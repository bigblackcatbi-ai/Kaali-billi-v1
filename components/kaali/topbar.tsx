'use client'

import { Menu, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PLATFORM_LIST } from '@/lib/mock-data'
import { PlatformIcon } from './platform-icons'
import { useKaali } from './store'

export function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { query, setQuery, view, setView, connected } = useKaali()

  function onChange(value: string) {
    setQuery(value)
    if (value.trim() && view.kind !== 'search') setView({ kind: 'search' })
    if (!value.trim() && view.kind === 'search') setView({ kind: 'library' })
  }

  function clear() {
    setQuery('')
    setView({ kind: 'library' })
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={onOpenSidebar}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>

      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search across all connected platforms…"
          aria-label="Search across connected platforms"
          className="h-10 w-full rounded-full border bg-secondary/60 pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:bg-secondary"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="hidden items-center gap-1.5 sm:flex" aria-label="Connected platforms">
        {PLATFORM_LIST.map((p) => {
          const on = connected.has(p.id)
          return (
            <span
              key={p.id}
              title={`${p.name}: ${on ? 'connected' : 'not connected'}`}
              className="flex size-7 items-center justify-center rounded-full ring-1 ring-border transition-opacity"
              style={{
                color: on ? p.color : undefined,
                opacity: on ? 1 : 0.35,
              }}
            >
              <PlatformIcon platform={p.id} className="size-3.5" />
            </span>
          )
        })}
      </div>
    </header>
  )
}
