'use client'

import Image from 'next/image'
import { Library, ListMusic, Plus, Check, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PLATFORM_LIST } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { CreatePlaylistDialog } from './create-playlist-dialog'
import { PlatformIcon } from './platform-icons'
import { useKaali } from './store'

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { view, setView, playlists, isConnected, toggleConnection } = useKaali()

  const go = (v: Parameters<typeof setView>[0]) => {
    setView(v)
    onNavigate?.()
  }

  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar p-4">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-1">
        <div className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-background ring-1 ring-border">
          <Image src="/kaali-billi-logo.png" alt="Kaali Billi logo" fill className="object-contain p-1" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">Kaali Billi</p>
          <p className="text-[11px] text-muted-foreground">your music, unified</p>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-1">
        <NavButton
          active={view.kind === 'library'}
          icon={<Library className="size-4" />}
          label="Master Library"
          onClick={() => go({ kind: 'library' })}
        />
      </nav>

      {/* Connections */}
      <div>
        <SectionLabel>Connections</SectionLabel>
        <div className="mt-2 flex flex-col gap-1.5">
          {PLATFORM_LIST.map((p) => {
            const connected = isConnected(p.id)
            return (
              <div
                key={p.id}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5"
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-md"
                  style={{
                    color: p.color,
                    backgroundColor: 'color-mix(in oklab, currentColor 14%, transparent)',
                  }}
                >
                  <PlatformIcon platform={p.id} className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{p.shortName}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
                <Button
                  variant={connected ? 'ghost' : 'secondary'}
                  size="sm"
                  className={cn('h-7 px-2 text-[11px]', connected && 'text-muted-foreground')}
                  onClick={() => toggleConnection(p.id)}
                >
                  {connected ? (
                    <>
                      <Check className="size-3" />
                      <span className="sr-only sm:not-sr-only">On</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="size-3" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Playlists */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between pr-1">
          <SectionLabel>Playlists</SectionLabel>
          <CreatePlaylistDialog
            trigger={
              <Button variant="ghost" size="icon" className="size-6" aria-label="Create playlist">
                <Plus className="size-4" />
              </Button>
            }
          />
        </div>
        <ScrollArea className="mt-2 -mr-2 flex-1 pr-2">
          <div className="flex flex-col gap-0.5">
            {playlists.length === 0 && (
              <p className="px-2 py-3 text-xs text-muted-foreground">
                No playlists yet. Create one to start collecting tracks across platforms.
              </p>
            )}
            {playlists.map((p) => (
              <NavButton
                key={p.id}
                active={view.kind === 'playlist' && view.id === p.id}
                icon={<ListMusic className="size-4" />}
                label={p.name}
                meta={`${p.trackIds.length}`}
                onClick={() => go({ kind: 'playlist', id: p.id })}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  )
}

function NavButton({
  active,
  icon,
  label,
  meta,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  meta?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors',
        active
          ? 'bg-accent font-medium text-foreground'
          : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
      )}
    >
      <span className={cn(active ? 'text-primary' : 'text-current')}>{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {meta && <span className="text-xs tabular-nums text-muted-foreground">{meta}</span>}
    </button>
  )
}
