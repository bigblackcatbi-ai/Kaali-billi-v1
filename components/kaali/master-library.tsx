'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { ExternalLink, Layers } from 'lucide-react'
import { buildMasterLibrary, dedupeKey, SOURCE_PLAYLISTS } from '@/lib/mock-data'
import type { PlatformId } from '@/lib/types'
import { EmptyConnections } from './empty-state'
import { SourceChip } from './source-chip'
import { useKaali } from './store'
import { TrackRow } from './track-row'

export function MasterLibrary() {
  const { tracks, connected } = useKaali()

  const merged = useMemo(
    () => buildMasterLibrary(tracks, connected),
    [tracks, connected],
  )

  const likedMerged = useMemo(
    () => merged.filter((m) => m.sources.some((s) => s.liked)),
    [merged],
  )

  const visiblePlaylists = SOURCE_PLAYLISTS.filter((p) => connected.has(p.platform))
  const dupeCount = merged.reduce((n, m) => n + (m.sources.length - 1), 0)

  if (connected.size === 0) return <EmptyConnections />

  return (
    <div className="flex flex-col gap-8 pb-16">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Master Library</h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Liked songs and playlists from every connected platform, merged into one place.
          {dupeCount > 0 && (
            <>
              {' '}
              <span className="text-foreground">{dupeCount}</span> duplicate
              {dupeCount === 1 ? '' : 's'} collapsed by track + artist.
            </>
          )}
        </p>
      </header>

      {/* Source playlists */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Playlists from your platforms
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visiblePlaylists.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-xl border bg-card p-3 transition-colors hover:bg-accent"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={p.cover || '/placeholder.svg'}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 45vw, 200px"
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <span className="absolute right-2 top-2">
                  <SourceChip platform={p.platform} />
                </span>
                <span className="absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                  <ExternalLink className="size-3.5" />
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.trackCount} tracks</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Merged liked songs */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Liked songs, merged
          </h2>
          <span className="text-xs text-muted-foreground">{likedMerged.length} tracks</span>
        </div>
        <div className="rounded-xl border bg-card/40 p-1.5">
          {likedMerged.map((m, i) => {
            const extra = m.sources
              .map((s) => s.platform)
              .filter((p) => p !== m.primary.platform) as PlatformId[]
            return (
              <TrackRow
                key={m.key}
                track={m.primary}
                index={i}
                extraSources={Array.from(new Set(extra))}
              />
            )
          })}
          {likedMerged.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No liked songs from your connected platforms yet.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export { dedupeKey }
