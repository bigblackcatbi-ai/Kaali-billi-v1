'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MasterLibrary } from './master-library'
import { PlaylistView } from './playlist-view'
import { SearchView } from './search-view'
import { Sidebar } from './sidebar'
import { useKaali } from './store'
import { Topbar } from './topbar'

export function Dashboard() {
  const { view } = useKaali()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 border-r md:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            'absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-72 max-w-[85vw] border-r shadow-xl transition-transform duration-200',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </Button>
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </div>
      </div>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            {view.kind === 'library' && <MasterLibrary />}
            {view.kind === 'search' && <SearchView />}
            {view.kind === 'playlist' && <PlaylistView playlistId={view.id} />}
          </div>
        </main>
      </div>
    </div>
  )
}
