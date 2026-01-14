import { useState, useCallback } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useIpAddress } from './useIpAddress'
import type { Id } from '../../convex/_generated/dataModel'

export type ConversionStatus = 'idle' | 'uploading' | 'converting' | 'completed' | 'error'

export interface ConversionItem {
  id: string
  file: File
  status: ConversionStatus
  progress: number
  error?: string
  conversionId?: Id<'conversions'>
}

export function useFileConverter() {
  const [conversions, setConversions] = useState<ConversionItem[]>([])
  const { ipAddress } = useIpAddress()

  const generateUploadUrl = useMutation(api.conversions.generateUploadUrl)
  const startConversion = useMutation(api.conversions.startConversion)

  const updateConversion = useCallback((id: string, updates: Partial<ConversionItem>) => {
    setConversions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    )
  }, [])

  const convertFile = useCallback(
    async (file: File, targetFormat: string) => {
      const id = crypto.randomUUID()
      const newConversion: ConversionItem = {
        id,
        file,
        status: 'uploading',
        progress: 0,
      }

      setConversions((prev) => [...prev, newConversion])

      try {
        // 1. Generate upload URL
        const uploadUrl = await generateUploadUrl()
        updateConversion(id, { progress: 20 })

        // 2. Upload file
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        })

        if (!uploadResponse.ok) {
          throw new Error('Upload failed')
        }

        const { storageId } = (await uploadResponse.json()) as { storageId: Id<'_storage'> }
        updateConversion(id, { progress: 50 })

        // 3. Start conversion
        const originalFormat = file.name.split('.').pop() || 'unknown'

        const result = await startConversion({
          storageId,
          originalFilename: file.name,
          originalFormat,
          targetFormat,
          originalSizeBytes: file.size,
          ipAddress: ipAddress ?? undefined,
        })

        updateConversion(id, {
          status: 'converting',
          progress: 75,
          conversionId: result.conversionId,
        })
      } catch (error) {
        updateConversion(id, {
          status: 'error',
          progress: 0,
          error: error instanceof Error ? error.message : 'Conversion failed',
        })
      }
    },
    [generateUploadUrl, startConversion, ipAddress, updateConversion]
  )

  const convertFiles = useCallback(
    async (files: File[], targetFormat: string) => {
      for (const file of files) {
        await convertFile(file, targetFormat)
      }
    },
    [convertFile]
  )

  const removeConversion = useCallback((id: string) => {
    setConversions((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setConversions((prev) => prev.filter((c) => c.status !== 'completed' && c.status !== 'error'))
  }, [])

  return {
    conversions,
    convertFile,
    convertFiles,
    removeConversion,
    clearCompleted,
    ipAddress,
  }
}
