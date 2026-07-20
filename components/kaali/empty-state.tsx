'use client'

import Image from 'next/image'
import { Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PLATFORM_LIST } from '@/lib/mock-data'
import { PlatformIcon } from './platform-icons'
import { useKaali } from './store'

export function EmptyConnections() {
  const { toggleConnection } = useKaali()
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="relative size-20 overflow-hidden rounded-2xl bg-card ring-1 ring-border">
        <Image src="/kaali-billi-logo.png" alt="" fill className="object-contain p-2" />
      </div>
      <div className="max-w-md space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-balance">
          Connect a platform to build your library
        </h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Kaali Billi pulls in your liked songs and playlists from Spotify, YouTube Music and
          SoundCloud, then merges them into one library. Nothing streams here — tracks open in
          their native app.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {PLATFORM_LIST.map((p) => (
          <Button key={p.id} variant="secondary" onClick={() => toggleConnection(p.id)}>
            <span style={{ color: p.color }}>
              <PlatformIcon platform={p.id} className="size-4" />
            </span>
            <Link2 className="size-3.5" />
            Connect {p.shortName}
          </Button>
        ))}
      </div>
    </div>
  )
}
