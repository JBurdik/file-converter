import { cn } from '@/lib/utils'

const OUTPUT_FORMATS = [
  { value: 'webp', label: 'WebP', description: 'Modern, best compression' },
  { value: 'jpeg', label: 'JPEG', description: 'Universal compatibility' },
  { value: 'png', label: 'PNG', description: 'Lossless, transparency' },
  { value: 'avif', label: 'AVIF', description: 'Next-gen, smallest size' },
  { value: 'gif', label: 'GIF', description: 'Animation support' },
  { value: 'tiff', label: 'TIFF', description: 'High quality, print' },
]

interface FormatSelectorProps {
  value: string
  onChange: (format: string) => void
  className?: string
}

export function FormatSelector({ value, onChange, className }: FormatSelectorProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor="format-select" className="text-sm font-medium text-text-secondary">
        Convert to:
      </label>
      <select
        id="format-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 px-4 rounded-[var(--button-radius)] border border-border bg-white text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring transition-all"
      >
        {OUTPUT_FORMATS.map((format) => (
          <option key={format.value} value={format.value}>
            {format.label} - {format.description}
          </option>
        ))}
      </select>
    </div>
  )
}
