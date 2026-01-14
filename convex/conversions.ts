import { v } from "convex/values";
import {
  query,
  mutation,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";

// Constants
const ANON_DAILY_LIMIT = 10;
const AUTH_DAILY_LIMIT = 50;
const SUPPORTED_INPUT_FORMATS = [
  "jpeg",
  "jpg",
  "png",
  "webp",
  "avif",
  "gif",
  "tiff",
  "bmp",
];
const SUPPORTED_OUTPUT_FORMATS = ["jpeg", "png", "webp", "avif", "gif", "tiff"];

// Helper: Get today's date string
function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

// ============ QUERIES ============

// Get single conversion with download URL
export const getConversion = query({
  args: { id: v.id("conversions") },
  handler: async (ctx, { id }) => {
    const conversion = await ctx.db.get(id);
    if (!conversion) return null;

    return {
      ...conversion,
      downloadUrl: conversion.convertedStorageId
        ? await ctx.storage.getUrl(conversion.convertedStorageId)
        : null,
    };
  },
});

// Get rate limit status for current user/IP
export const getRateLimitStatus = query({
  args: {
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, { ipAddress }) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject; // subject is the user ID in JWT

    const identifier = userId ? `user:${userId}` : `ip:${ipAddress}`;
    if (!userId && !ipAddress) {
      return {
        remaining: ANON_DAILY_LIMIT,
        limit: ANON_DAILY_LIMIT,
        currentCount: 0,
        isAuthenticated: false,
        resetsAt: getTodayDateString() + "T23:59:59Z",
      };
    }

    const today = getTodayDateString();
    const isAuthenticated = !!userId;
    const limit = isAuthenticated ? AUTH_DAILY_LIMIT : ANON_DAILY_LIMIT;

    const record = await ctx.db
      .query("rateLimits")
      .withIndex("by_identifier_date", (q) =>
        q.eq("identifier", identifier).eq("date", today),
      )
      .first();

    const currentCount = record?.count ?? 0;
    const remaining = Math.max(0, limit - currentCount);

    return {
      remaining,
      limit,
      currentCount,
      isAuthenticated,
      resetsAt: today + "T23:59:59Z",
    };
  },
});

// List user's conversion history
export const listMyConversions = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 20 }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;
    const conversions = await ctx.db
      .query("conversions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return Promise.all(
      conversions.map(async (conv) => ({
        ...conv,
        downloadUrl: conv.convertedStorageId
          ? await ctx.storage.getUrl(conv.convertedStorageId)
          : null,
      })),
    );
  },
});

// ============ MUTATIONS ============

// Generate upload URL for Convex storage
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Start a new conversion
export const startConversion = mutation({
  args: {
    storageId: v.id("_storage"),
    originalFilename: v.string(),
    originalFormat: v.string(),
    targetFormat: v.string(),
    originalSizeBytes: v.number(),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    // Build identifier for rate limiting
    const identifier = userId ? `user:${userId}` : `ip:${args.ipAddress}`;
    if (!userId && !args.ipAddress) {
      throw new Error("IP address required for anonymous conversions");
    }

    // Check rate limit
    const today = getTodayDateString();
    const limit = userId ? AUTH_DAILY_LIMIT : ANON_DAILY_LIMIT;

    const rateLimitRecord = await ctx.db
      .query("rateLimits")
      .withIndex("by_identifier_date", (q) =>
        q.eq("identifier", identifier).eq("date", today),
      )
      .first();

    const currentCount = rateLimitRecord?.count ?? 0;
    if (currentCount >= limit) {
      throw new Error(
        `Rate limit exceeded. You have used ${currentCount}/${limit} conversions today. ` +
          (userId ? "" : "Sign up to get 50 conversions per day!"),
      );
    }

    // Validate formats
    const inputFormat = args.originalFormat.toLowerCase().replace(".", "");
    const outputFormat = args.targetFormat.toLowerCase().replace(".", "");

    if (!SUPPORTED_INPUT_FORMATS.includes(inputFormat)) {
      throw new Error(`Unsupported input format: ${inputFormat}`);
    }
    if (!SUPPORTED_OUTPUT_FORMATS.includes(outputFormat)) {
      throw new Error(`Unsupported output format: ${outputFormat}`);
    }

    // Create conversion record
    const conversionId = await ctx.db.insert("conversions", {
      userId: userId ?? undefined,
      ipAddress: args.ipAddress || undefined,
      originalStorageId: args.storageId,
      originalFilename: args.originalFilename,
      originalFormat: inputFormat,
      targetFormat: outputFormat,
      originalSizeBytes: args.originalSizeBytes,
      status: "pending",
      createdAt: Date.now(),
    });

    // Increment rate limit
    if (rateLimitRecord) {
      await ctx.db.patch(rateLimitRecord._id, {
        count: rateLimitRecord.count + 1,
      });
    } else {
      await ctx.db.insert("rateLimits", {
        identifier,
        date: today,
        count: 1,
        limit,
      });
    }

    // Schedule the action to process the conversion (in actions.ts with "use node")
    await ctx.scheduler.runAfter(0, internal.actions.processConversion, {
      conversionId,
    });

    return { conversionId };
  },
});

// Delete a conversion and its files
export const deleteConversion = mutation({
  args: { id: v.id("conversions") },
  handler: async (ctx, { id }) => {
    const conversion = await ctx.db.get(id);
    if (!conversion) throw new Error("Conversion not found");

    // Verify ownership
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (conversion.userId && conversion.userId !== userId) {
      throw new Error("Not authorized to delete this conversion");
    }

    // Delete storage files
    await ctx.storage.delete(conversion.originalStorageId);
    if (conversion.convertedStorageId) {
      await ctx.storage.delete(conversion.convertedStorageId);
    }

    await ctx.db.delete(id);
  },
});

// ============ INTERNAL FUNCTIONS ============

// Internal: Get conversion (for actions)
export const getConversionInternal = internalQuery({
  args: { id: v.id("conversions") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Internal: Update conversion status
export const updateConversionStatus = internalMutation({
  args: {
    id: v.id("conversions"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    convertedStorageId: v.optional(v.id("_storage")),
    convertedSizeBytes: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { id, status, convertedStorageId, convertedSizeBytes, errorMessage },
  ) => {
    const updates: Record<string, unknown> = { status };

    if (convertedStorageId) updates.convertedStorageId = convertedStorageId;
    if (convertedSizeBytes !== undefined)
      updates.convertedSizeBytes = convertedSizeBytes;
    if (errorMessage) updates.errorMessage = errorMessage;
    if (status === "completed" || status === "failed") {
      updates.completedAt = Date.now();
    }

    await ctx.db.patch(id, updates);
  },
});

// Internal: Generate upload URL (for actions)
export const generateUploadUrlInternal = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Internal: Cleanup old conversions (called by cron)
const CLEANUP_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export const cleanupOldConversions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoffTime = Date.now() - CLEANUP_AGE_MS;

    // Find old conversions using index
    const oldConversions = await ctx.db
      .query("conversions")
      .withIndex("by_createdAt", (q) => q.lt("createdAt", cutoffTime))
      .take(100); // Process in batches to avoid timeout

    let deletedCount = 0;
    for (const conversion of oldConversions) {
      // Delete storage files
      try {
        await ctx.storage.delete(conversion.originalStorageId);
      } catch {
        // File may already be deleted
      }

      if (conversion.convertedStorageId) {
        try {
          await ctx.storage.delete(conversion.convertedStorageId);
        } catch {
          // File may already be deleted
        }
      }

      // Delete conversion record
      await ctx.db.delete(conversion._id);
      deletedCount++;
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old conversions`);
    }
  },
});

// Internal: Decrement rate limit on failed conversion (refund)
export const decrementRateLimit = internalMutation({
  args: {
    conversionId: v.id("conversions"),
  },
  handler: async (ctx, { conversionId }) => {
    const conversion = await ctx.db.get(conversionId);
    if (!conversion) return;

    const today = getTodayDateString();
    const identifier = conversion.userId
      ? `user:${conversion.userId}`
      : `ip:${conversion.ipAddress}`;

    const record = await ctx.db
      .query("rateLimits")
      .withIndex("by_identifier_date", (q) =>
        q.eq("identifier", identifier).eq("date", today),
      )
      .first();

    if (record && record.count > 0) {
      await ctx.db.patch(record._id, { count: record.count - 1 });
    }
  },
});
