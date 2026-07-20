'use client'

import { useMemo } from 'react'
import { Search } from 'lucide-react'
import { PLATFORM_LIST } from '@/lib/mock-data'
import type { Platform } from '@/lib/types'
import { PlatformIcon } from './platform-icons'
import { useKaali } from './store'
import { TrackRow } from './track-row'

export function SearchView() {
  const { query, tracks, connected } = useKaali()
  const q = query.trim().toLowerCase()

  const grouped = useMemo(() => {
    return PLATFORM_LIST.filter((p) => connected.has(p.id)).map((platform) => ({
      platform,
      results: tracks.filter(
        (t) =>
          t.platform === platform.id &&
          (t.title.toLowerCase().includes(q) ||
            t.artist.toLowerCase().includes(q) ||
            (t.album ?? '').toLowerCase().includes(q)),
      ),
    }))
  }, [tracks, connected, q])

  const total = grouped.reduce((n, g) => n + g.results.length, 0)

  return (
    <div className="flex flex-col gap-8 pb-16">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Results for <span className="text-primary">“{query}”</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          {total} match{total === 1 ? '' : 'es'} across {grouped.length} connected platform
          {grouped.length === 1 ? '' : 's'}.
        </p>
      </header>

      {total === 0 && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
          <Search className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nothing found. Try another title or artist.
          </p>
        </div>
      )}

      {grouped.map(
        ({ platform, results }) =>
          results.length > 0 && (
            <PlatformSection key={platform.id} platform={platform} count={results.length}>
              <div className="rounded-xl border bg-card/40 p-1.5">
                {results.map((t) => (
                  <TrackRow key={t.id} track={t} />
                ))}
              </div>
            </PlatformSection>
          ),
      )}
    </div>
  )
}

function PlatformSection({
  platform,
  count,
  children,
}: {
  platform: Platform
  count: number
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-2" style={{ color: platform.color }}>
          <PlatformIcon platform={platform.id} className="size-4" />
          <h2 className="text-sm font-semibold text-foreground">{platform.name}</h2>
        </span>
        <span className="text-xs text-muted-foreground">{count}</span>
      </div>
      {children}
    </section>
  )
}
