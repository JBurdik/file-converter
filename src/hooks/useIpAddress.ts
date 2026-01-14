import { useState, useEffect } from 'react'

export function useIpAddress() {
  const [ipAddress, setIpAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchIp() {
      try {
        const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL
        const response = await fetch(`${convexSiteUrl}/api/ip`)
        const data = await response.json()
        setIpAddress(data.ip)
      } catch (error) {
        console.error('Failed to fetch IP:', error)
        setIpAddress('unknown')
      } finally {
        setLoading(false)
      }
    }
    fetchIp()
  }, [])

  return { ipAddress, loading }
}
