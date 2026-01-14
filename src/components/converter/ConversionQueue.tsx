import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Progress } from '@/components/ui/Progress'
import { Download, Loader2, CheckCircle, XCircle, FileImage, X } from 'lucide-react'
import type { ConversionItem } from '@/hooks/useFileConverter'

interface ConversionQueueProps {
  items: ConversionItem[]
  targetFormat: string
  onRemove: (id: string) => void
}

export function ConversionQueue({ items, targetFormat, onRemove }: ConversionQueueProps) {
  if (items.length === 0) return null

  return (
    <div className="w-full max-w-[860px] mt-6 space-y-3">
      {items.map((item) => (
        <ConversionQueueItem
          key={item.id}
          item={item}
          targetFormat={targetFormat}
          onRemove={() => onRemove(item.id)}
        />
      ))}
    </div>
  )
}

interface ConversionQueueItemProps {
  item: ConversionItem
  targetFormat: string
  onRemove: () => void
}

function ConversionQueueItem({ item, targetFormat, onRemove }: ConversionQueueItemProps) {
  // Subscribe to conversion status if we have a conversionId
  const conversion = useQuery(
    api.conversions.getConversion,
    item.conversionId ? { id: item.conversionId } : 'skip'
  )

  // Determine the current status and progress
  // Prioritize server status when available
  const serverStatus = conversion?.status
  const isCompleted = serverStatus === 'completed'
  const isFailed = serverStatus === 'failed' || item.status === 'error'
  const isUploading = !serverStatus && item.status === 'uploading'
  const isProcessing = !isCompleted && !isFailed && !isUploading

  // Calculate progress
  let progress = item.progress
  if (conversion) {
    if (conversion.status === 'processing') progress = 75
    else if (conversion.status === 'completed') progress = 100
    else if (conversion.status === 'failed') progress = 0
  }

  const originalFormat = item.file.name.split('.').pop()?.toUpperCase() || 'FILE'

  return (
    <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* File info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 flex items-center justify-center">
              <FileImage className="w-5 h-5 text-brand-blue" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-text-primary truncate">{item.file.name}</p>
              <p className="text-sm text-text-secondary">
                {originalFormat} → {targetFormat.toUpperCase()}
                {conversion?.convertedSizeBytes && (
                  <span className="ml-2 text-text-hint">
                    ({formatBytes(conversion.convertedSizeBytes)})
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Status and actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Progress percentage */}
            {!isCompleted && !isFailed && (
              <span className="text-sm font-medium text-text-secondary min-w-[3ch] text-right">
                {progress}%
              </span>
            )}

            {/* Status icon */}
            <div className="flex-shrink-0">
              {isUploading && (
                <Loader2 className="w-5 h-5 text-brand-blue animate-spin" />
              )}
              {isProcessing && !isUploading && (
                <Loader2 className="w-5 h-5 text-brand-blue animate-spin" />
              )}
              {isCompleted && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {isFailed && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>

            {/* Download button */}
            {isCompleted && conversion?.downloadUrl && (
              <a
                href={conversion.downloadUrl}
                download={getDownloadFilename(item.file.name, targetFormat)}
                className="inline-flex items-center justify-center h-9 px-4 gap-1.5 text-sm font-medium bg-gradient-to-b from-[var(--button-gradient-from)] to-[var(--button-gradient-to)] text-white rounded-[var(--button-radius)] shadow-[var(--button-shadow)] hover:shadow-[var(--button-shadow-hover)] hover:from-[var(--button-gradient-hover-from)] hover:to-[var(--button-gradient-hover-to)] active:scale-[0.98] transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            )}

            {/* Remove button */}
            <button
              onClick={onRemove}
              className="p-1.5 rounded-full text-text-hint hover:text-text-secondary hover:bg-muted transition-colors"
              aria-label="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {!isCompleted && !isFailed && (
          <div className="mt-3">
            <Progress value={progress} />
          </div>
        )}

        {/* Error message */}
        {isFailed && conversion?.errorMessage && (
          <p className="mt-2 text-sm text-red-500">{conversion.errorMessage}</p>
        )}
        {isFailed && item.error && !conversion?.errorMessage && (
          <p className="mt-2 text-sm text-red-500">{item.error}</p>
        )}
      </div>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

function getDownloadFilename(originalName: string, targetFormat: string): string {
  const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName
  return `${baseName}.${targetFormat}`
}
