import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useCallback } from 'react'
import { Upload } from 'lucide-react'
import CloudIllustration from '../components/CloudIllustration'

export const Route = createFileRoute('/')({ component: FileConverterLanding })

function FileConverterLanding() {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      console.log('Dropped files:', files)
      // TODO: Handle file upload
    }
  }, [])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      console.log('Selected files:', files)
      // TODO: Handle file upload
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-[radial-gradient(circle_at_top,#EBF3FF_0%,#FFFFFF_100%)]">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-6 pt-16">
        {/* Heading */}
        <h1 className="text-5xl font-bold tracking-tight text-text-primary mb-6">
          File Converter
        </h1>
        <p className="text-lg text-text-secondary mb-10">
          Convert your files instantly without any ads or registration
        </p>

        {/* Dropzone */}
        <div
          className={`
            w-full max-w-[860px] aspect-[16/7]
            border-[1.5px] border-dashed rounded-[4px]
            flex flex-col items-center justify-center
            transition-all duration-200
            ${
              isDragOver
                ? 'border-brand-blue bg-brand-blue/5'
                : 'border-border-dropzone bg-white/80'
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
          <button
            onClick={handleUploadClick}
            className="
              flex items-center gap-2
              px-8 py-4
              bg-gradient-to-b from-brand-blue-light to-brand-blue
              text-white font-medium
              rounded-[10px]
              shadow-[0_4px_12px_rgba(45,136,255,0.3)]
              hover:shadow-[0_6px_16px_rgba(45,136,255,0.4)]
              hover:from-[#5AA8FF] hover:to-brand-blue-light
              transition-all duration-200
              active:scale-[0.98]
            "
          >
            <Upload className="w-5 h-5" />
            <span>Upload Files</span>
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Hint text */}
          <p className="mt-4 text-sm text-text-hint">
            or drag and drop files here
          </p>
        </div>
      </main>
    </div>
  )
}
