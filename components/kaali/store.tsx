'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { SOURCE_PLAYLISTS, TRACKS } from '@/lib/mock-data'
import type { LocalPlaylist, PlatformId, Track } from '@/lib/types'

export type View =
  | { kind: 'library' }
  | { kind: 'search' }
  | { kind: 'playlist'; id: string }

interface KaaliState {
  connected: Set<PlatformId>
  playlists: LocalPlaylist[]
  view: View
  query: string
}

interface KaaliContextValue extends KaaliState {
  tracks: Track[]
  trackById: (id: string) => Track | undefined
  toggleConnection: (id: PlatformId) => void
  isConnected: (id: PlatformId) => boolean
  setView: (view: View) => void
  setQuery: (q: string) => void
  createPlaylist: (name: string, description?: string) => string
  deletePlaylist: (id: string) => void
  addTrackToPlaylist: (playlistId: string, trackId: string) => void
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void
  launch: (track: Track) => void
}

const KaaliContext = createContext<KaaliContextValue | null>(null)

let idCounter = 0
const uid = () => `pl_${Date.now().toString(36)}_${(idCounter++).toString(36)}`

export function KaaliProvider({ children }: { children: ReactNode }) {
  // Start with Spotify + YouTube connected to make the demo feel alive.
  const [connected, setConnected] = useState<Set<PlatformId>>(
    () => new Set<PlatformId>(['spotify', 'youtube']),
  )
  const [playlists, setPlaylists] = useState<LocalPlaylist[]>(() => [
    {
      id: 'pl_starter',
      name: 'Late Night Loop',
      description: 'Cross-platform picks for the small hours.',
      createdAt: Date.now(),
      trackIds: ['spotify:3k1a2b9c', 'youtube:yt_x0Pd44m', 'soundcloud:ocean-static/deep-current'],
    },
  ])
  const [view, setView] = useState<View>({ kind: 'library' })
  const [query, setQuery] = useState('')

  const trackById = useCallback(
    (id: string) => TRACKS.find((t) => t.id === id),
    [],
  )

  const isConnected = useCallback((id: PlatformId) => connected.has(id), [connected])

  const toggleConnection = useCallback((id: PlatformId) => {
    setConnected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        toast(`Disconnected ${labelFor(id)}`)
      } else {
        next.add(id)
        toast.success(`Connected ${labelFor(id)}`, {
          description: 'Placeholder OAuth — wire up real keys later.',
        })
      }
      return next
    })
  }, [])

  const createPlaylist = useCallback((name: string, description?: string) => {
    const id = uid()
    setPlaylists((prev) => [
      { id, name, description, createdAt: Date.now(), trackIds: [] },
      ...prev,
    ])
    toast.success(`Created playlist “${name}”`)
    return id
  }, [])

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id))
    setView((v) => (v.kind === 'playlist' && v.id === id ? { kind: 'library' } : v))
    toast('Playlist deleted')
  }, [])

  const addTrackToPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p
        if (p.trackIds.includes(trackId)) {
          toast('Already in this playlist')
          return p
        }
        toast.success('Added to playlist')
        return { ...p, trackIds: [...p.trackIds, trackId] }
      }),
    )
  }, [])

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, trackIds: p.trackIds.filter((t) => t !== trackId) }
          : p,
      ),
    )
  }, [])

  const launch = useCallback((track: Track) => {
    toast(`Opening in ${labelFor(track.platform)}…`, {
      description: `${track.title} — ${track.artist}`,
    })
    if (typeof window !== 'undefined') {
      window.open(track.url, '_blank', 'noopener,noreferrer')
    }
  }, [])

  const value = useMemo<KaaliContextValue>(
    () => ({
      connected,
      playlists,
      view,
      query,
      tracks: TRACKS,
      trackById,
      toggleConnection,
      isConnected,
      setView,
      setQuery,
      createPlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      launch,
    }),
    [
      connected,
      playlists,
      view,
      query,
      trackById,
      toggleConnection,
      isConnected,
      createPlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      launch,
    ],
  )

  return <KaaliContext.Provider value={value}>{children}</KaaliContext.Provider>
}

export function useKaali() {
  const ctx = useContext(KaaliContext)
  if (!ctx) throw new Error('useKaali must be used within KaaliProvider')
  return ctx
}

function labelFor(id: PlatformId) {
  return id === 'youtube' ? 'YouTube Music' : id === 'soundcloud' ? 'SoundCloud' : 'Spotify'
}

export { SOURCE_PLAYLISTS }
