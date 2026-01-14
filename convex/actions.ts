"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id, Doc } from "./_generated/dataModel";

// Timeout for conversion (30 seconds)
const CONVERSION_TIMEOUT_MS = 30000;

// Process conversion using sharp
export const processConversion = internalAction({
  args: {
    conversionId: v.id("conversions"),
  },
  returns: v.null(),
  handler: async (ctx, { conversionId }): Promise<null> => {
    const conversion: Doc<"conversions"> | null = await ctx.runQuery(
      internal.conversions.getConversionInternal,
      { id: conversionId }
    );

    if (!conversion) {
      throw new Error("Conversion not found");
    }

    await ctx.runMutation(internal.conversions.updateConversionStatus, {
      id: conversionId,
      status: "processing",
    });

    try {
      await Promise.race([
        performConversion(ctx, conversion, conversionId),
        new Promise<void>((_, reject) =>
          setTimeout(
            () => reject(new Error("Conversion timed out")),
            CONVERSION_TIMEOUT_MS
          )
        ),
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      await ctx.runMutation(internal.conversions.updateConversionStatus, {
        id: conversionId,
        status: "failed",
        errorMessage,
      });

      await ctx.runMutation(internal.conversions.decrementRateLimit, {
        conversionId,
      });
    }

    return null;
  },
});

async function performConversion(
  ctx: any,
  conversion: Doc<"conversions">,
  conversionId: Id<"conversions">
): Promise<void> {
  const sharp = (await import("sharp")).default;

  const fileUrl = await ctx.storage.getUrl(conversion.originalStorageId);
  if (!fileUrl) {
    throw new Error("Original file not found in storage");
  }

  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  let sharpInstance = sharp(inputBuffer);
  let mimeType: string;

  switch (conversion.targetFormat) {
    case "jpeg":
    case "jpg":
      sharpInstance = sharpInstance.jpeg({ quality: 85 });
      mimeType = "image/jpeg";
      break;
    case "png":
      sharpInstance = sharpInstance.png({ compressionLevel: 9 });
      mimeType = "image/png";
      break;
    case "webp":
      sharpInstance = sharpInstance.webp({ quality: 85 });
      mimeType = "image/webp";
      break;
    case "avif":
      sharpInstance = sharpInstance.avif({ quality: 80 });
      mimeType = "image/avif";
      break;
    case "gif":
      sharpInstance = sharpInstance.gif();
      mimeType = "image/gif";
      break;
    case "tiff":
      sharpInstance = sharpInstance.tiff({ quality: 85 });
      mimeType = "image/tiff";
      break;
    default:
      throw new Error(`Unsupported output format: ${conversion.targetFormat}`);
  }

  const outputBuffer = await sharpInstance.toBuffer();

  const uint8Array = new Uint8Array(outputBuffer);
  const blob = new Blob([uint8Array], { type: mimeType });
  const uploadUrl: string = await ctx.runMutation(
    internal.conversions.generateUploadUrlInternal,
    {}
  );

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": mimeType },
    body: blob,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload converted file");
  }

  const { storageId } = (await uploadResponse.json()) as {
    storageId: Id<"_storage">;
  };

  await ctx.runMutation(internal.conversions.updateConversionStatus, {
    id: conversionId,
    status: "completed",
    convertedStorageId: storageId,
    convertedSizeBytes: outputBuffer.length,
  });
}
