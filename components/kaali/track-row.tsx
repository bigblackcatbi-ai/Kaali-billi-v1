'use client'

import Image from 'next/image'
import { ExternalLink, ListPlus, Play, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDuration } from '@/lib/mock-data'
import type { PlatformId, Track } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useKaali } from './store'
import { SourceChip } from './source-chip'

export function TrackRow({
  track,
  index,
  extraSources,
  onRemove,
}: {
  track: Track
  index?: number
  /** Additional platforms this track is also available on (master library). */
  extraSources?: PlatformId[]
  /** If provided, shows a remove button (playlist context). */
  onRemove?: () => void
}) {
  const { launch } = useKaali()

  return (
    <div
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent sm:px-3"
      onDoubleClick={() => launch(track)}
    >
      <div className="flex items-center gap-3">
        {typeof index === 'number' && (
          <span className="hidden w-5 text-right text-xs tabular-nums text-muted-foreground sm:block">
            {index + 1}
          </span>
        )}
        <button
          type="button"
          onClick={() => launch(track)}
          className="relative size-11 shrink-0 overflow-hidden rounded-md"
          aria-label={`Open ${track.title} in ${track.platform}`}
        >
          <Image
            src={track.cover || '/placeholder.svg'}
            alt=""
            fill
            sizes="44px"
            className="object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
            <Play className="size-4 fill-current" />
          </span>
        </button>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => launch(track)}
            className="truncate text-left text-sm font-medium hover:underline"
          >
            {track.title}
          </button>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
          <div className="flex items-center gap-1">
            <SourceChip platform={track.platform} />
            {extraSources?.map((p) => <SourceChip key={p} platform={p} />)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">
          {formatDuration(track.duration)}
        </span>
        <AddToPlaylistMenu track={track} />
        {onRemove ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            aria-label="Remove from playlist"
          >
            <Trash2 className="size-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground"
            onClick={() => launch(track)}
            aria-label={`Open in ${track.platform}`}
          >
            <ExternalLink className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function AddToPlaylistMenu({
  track,
  className,
}: {
  track: Track
  className?: string
}) {
  const { playlists, addTrackToPlaylist, createPlaylist } = useKaali()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('size-8 text-muted-foreground', className)}
          aria-label="Add to playlist"
        >
          <ListPlus className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Add to playlist</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {playlists.length === 0 && (
          <DropdownMenuItem disabled>No playlists yet</DropdownMenuItem>
        )}
        {playlists.map((p) => (
          <DropdownMenuItem key={p.id} onSelect={() => addTrackToPlaylist(p.id, track.id)}>
            {p.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            const id = createPlaylist(`New Playlist`)
            addTrackToPlaylist(id, track.id)
          }}
        >
          <Plus className="size-4" />
          New playlist with this track
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
