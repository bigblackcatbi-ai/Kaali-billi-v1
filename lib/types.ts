export type PlatformId = 'spotify' | 'youtube' | 'soundcloud'

export interface Platform {
  id: PlatformId
  name: string
  /** Short label used for YouTube Music etc. */
  shortName: string
  /** Brand color as a CSS color string, used only for small source chips. */
  color: string
}

export interface Track {
  /** Stable local id (platform + external id). */
  id: string
  /** The id used by the source platform — what a real API/deep link needs. */
  externalId: string
  title: string
  artist: string
  album?: string
  /** Duration in seconds. */
  duration: number
  platform: PlatformId
  /** Cover art url (mock). */
  cover: string
  /** The deep link / web player url this track launches. */
  url: string
  /** Whether the user has "liked" this on the source platform. */
  liked?: boolean
}

export interface SourcePlaylist {
  id: string
  name: string
  platform: PlatformId
  trackCount: number
  cover: string
  url: string
}

/** A playlist created locally inside Kaali Billi. Stores references only. */
export interface LocalPlaylist {
  id: string
  name: string
  description?: string
  createdAt: number
  /** References to tracks by their local id. */
  trackIds: string[]
}

export type SearchResults = Record<PlatformId, Track[]>
