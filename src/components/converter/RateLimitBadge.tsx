import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

interface RateLimitBadgeProps {
  ipAddress?: string | null
}

export function RateLimitBadge({ ipAddress }: RateLimitBadgeProps) {
  const status = useQuery(api.conversions.getRateLimitStatus, {
    ipAddress: ipAddress ?? undefined,
  })

  if (!status) return null

  const isLow = status.remaining <= 3
  const isEmpty = status.remaining === 0

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`text-sm ${
          isEmpty
            ? 'text-red-500'
            : isLow
              ? 'text-orange-500'
              : 'text-text-hint'
        }`}
      >
        <span className="font-medium">{status.remaining}</span>
        <span> / {status.limit} conversions remaining today</span>
      </div>
      {!status.isAuthenticated && status.remaining <= 5 && (
        <p className="text-xs text-brand-blue">
          Sign up for 50 daily conversions!
        </p>
      )}
    </div>
  )
}
