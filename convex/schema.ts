import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  products: defineTable({
    title: v.string(),
    imageId: v.string(),
    price: v.number(),
  }),
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),

  // Conversion records
  conversions: defineTable({
    userId: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    originalStorageId: v.id('_storage'),
    convertedStorageId: v.optional(v.id('_storage')),
    originalFilename: v.string(),
    originalFormat: v.string(),
    targetFormat: v.string(),
    originalSizeBytes: v.number(),
    convertedSizeBytes: v.optional(v.number()),
    status: v.union(
      v.literal('pending'),
      v.literal('processing'),
      v.literal('completed'),
      v.literal('failed')
    ),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index('by_user', ['userId', 'createdAt'])
    .index('by_ip', ['ipAddress', 'createdAt'])
    .index('by_status', ['status'])
    .index('by_createdAt', ['createdAt']),

  // Rate limiting (daily counters)
  rateLimits: defineTable({
    identifier: v.string(), // "user:{userId}" or "ip:{ipAddress}"
    date: v.string(), // "2024-01-15"
    count: v.number(),
    limit: v.number(),
  }).index('by_identifier_date', ['identifier', 'date']),
})
