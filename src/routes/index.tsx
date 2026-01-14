import { createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import CloudIllustration from "../components/CloudIllustration";
import { Button } from "@/components/ui/Button";
import { FormatSelector } from "@/components/converter/FormatSelector";
import { ConversionQueue } from "@/components/converter/ConversionQueue";
import { RateLimitBadge } from "@/components/converter/RateLimitBadge";
import { useFileConverter } from "@/hooks/useFileConverter";

export const Route = createFileRoute("/")({ component: FileConverterLanding });

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/tiff",
  "image/bmp",
];

function FileConverterLanding() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [targetFormat, setTargetFormat] = useState("webp");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { conversions, convertFiles, removeConversion, ipAddress } =
    useFileConverter();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFiles = useCallback(
    async (files: File[]) => {
      // Filter to only supported image types
      const imageFiles = files.filter((f) =>
        SUPPORTED_IMAGE_TYPES.includes(f.type)
      );
      if (imageFiles.length > 0) {
        await convertFiles(imageFiles, targetFormat);
      }
    },
    [convertFiles, targetFormat]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [handleFiles]
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[radial-gradient(circle_at_top,#EBF3FF_0%,#FFFFFF_100%)]">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-6 pt-16 pb-12">
        {/* Heading */}
        <h1 className="text-5xl font-bold tracking-tight text-text-primary mb-6">
          File Converter
        </h1>
        <p className="text-lg text-text-secondary mb-6">
          Convert your files instantly without any ads or registration
        </p>

        {/* Rate limit badge */}
        <div className="mb-6">
          <RateLimitBadge ipAddress={ipAddress} />
        </div>

        {/* Format selector */}
        <div className="mb-6">
          <FormatSelector value={targetFormat} onChange={setTargetFormat} />
        </div>

        {/* Dropzone */}
        <div
          className={`
            w-full max-w-[860px] aspect-[16/7]
            border-[1.5px] border-dashed rounded-[4px]
            flex flex-col items-center justify-center
            transition-all duration-200
            ${
              isDragOver
                ? "border-brand-blue bg-brand-blue/5"
                : "border-border-dropzone bg-white/80"
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Cloud illustration */}
          <div className="mb-6">
            <CloudIllustration />
          </div>

          {/* Upload button */}
          <Button variant="default" size="lg" onClick={handleUploadClick}>
            <Upload className="w-5 h-5" />
            <span>Upload Files</span>
          </Button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Hint text */}
          <p className="mt-4 text-sm text-text-hint">
            or drag and drop images here
          </p>
          <p className="mt-2 text-xs text-text-hint/70">
            Files are automatically deleted after 24 hours
          </p>
        </div>

        {/* Conversion queue */}
        <ConversionQueue
          items={conversions}
          targetFormat={targetFormat}
          onRemove={removeConversion}
        />
      </main>
    </div>
  );
}
