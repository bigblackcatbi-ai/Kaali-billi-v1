'use client'

import { useMemo } from 'react'
import { ListMusic, Play, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDuration } from '@/lib/mock-data'
import { useKaali } from './store'
import { TrackRow } from './track-row'

export function PlaylistView({ playlistId }: { playlistId: string }) {
  const { playlists, trackById, removeTrackFromPlaylist, deletePlaylist, launch, setView } =
    useKaali()

  const playlist = playlists.find((p) => p.id === playlistId)

  const tracks = useMemo(
    () => (playlist ? playlist.trackIds.map((id) => trackById(id)).filter(Boolean) : []),
    [playlist, trackById],
  )

  if (!playlist) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">This playlist no longer exists.</p>
        <Button variant="secondary" onClick={() => setView({ kind: 'library' })}>
          Back to library
        </Button>
      </div>
    )
  }

  const totalSeconds = tracks.reduce((n, t) => n + (t?.duration ?? 0), 0)

  return (
    <div className="flex flex-col gap-6 pb-16">
      <header className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-xl bg-secondary sm:size-28">
            <ListMusic className="size-10 text-primary" />
          </div>
          <div className="flex min-w-0 flex-col gap-1 pt-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Local Playlist
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-sm text-muted-foreground text-pretty">{playlist.description}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {tracks.length} track{tracks.length === 1 ? '' : 's'}
              {totalSeconds > 0 && <> · {formatDuration(totalSeconds)}</>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={tracks.length === 0}
            onClick={() => tracks[0] && launch(tracks[0]!)}
          >
            <Play className="size-4 fill-current" />
            Play first track
          </Button>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => deletePlaylist(playlist.id)}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </header>

      <div className="rounded-xl border bg-card/40 p-1.5">
        {tracks.map(
          (t, i) =>
            t && (
              <TrackRow
                key={t.id}
                track={t}
                index={i}
                onRemove={() => removeTrackFromPlaylist(playlist.id, t.id)}
              />
            ),
        )}
        {tracks.length === 0 && (
          <div className="flex flex-col items-center gap-1 px-3 py-10 text-center">
            <p className="text-sm font-medium">This playlist is empty</p>
            <p className="text-xs text-muted-foreground">
              Add tracks from your library or search using the{' '}
              <span className="text-foreground">＋</span> menu on any track.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
