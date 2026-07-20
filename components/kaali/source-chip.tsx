import { PLATFORMS } from '@/lib/mock-data'
import type { PlatformId } from '@/lib/types'
import { cn } from '@/lib/utils'
import { PlatformIcon } from './platform-icons'

export function SourceChip({
  platform,
  showLabel = false,
  className,
}: {
  platform: PlatformId
  showLabel?: boolean
  className?: string
}) {
  const p = PLATFORMS[platform]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium',
        className,
      )}
      style={{
        color: p.color,
        borderColor: 'color-mix(in oklab, currentColor 30%, transparent)',
        backgroundColor: 'color-mix(in oklab, currentColor 12%, transparent)',
      }}
    >
      <PlatformIcon platform={platform} className="size-3" />
      {showLabel && p.shortName}
    </span>
  )
}
