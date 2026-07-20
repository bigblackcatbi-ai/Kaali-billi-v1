import type { Platform, PlatformId, SourcePlaylist, Track } from './types'

export const PLATFORMS: Record<PlatformId, Platform> = {
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    shortName: 'Spotify',
    color: 'oklch(0.72 0.19 150)',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube Music',
    shortName: 'YT Music',
    color: 'oklch(0.63 0.24 27)',
  },
  soundcloud: {
    id: 'soundcloud',
    name: 'SoundCloud',
    shortName: 'SoundCloud',
    color: 'oklch(0.72 0.19 45)',
  },
}

export const PLATFORM_LIST: Platform[] = [
  PLATFORMS.spotify,
  PLATFORMS.youtube,
  PLATFORMS.soundcloud,
]

const COVERS = {
  midnight: '/covers/midnight-tape.png',
  neon: '/covers/neon-district.png',
  golden: '/covers/golden-hour.png',
  concrete: '/covers/concrete-bloom.png',
  deep: '/covers/deep-current.png',
  static: '/covers/static-signal.png',
  paper: '/covers/paper-moon.png',
  velvet: '/covers/velvet-room.png',
  highwire: '/covers/high-wire.png',
  dust: '/covers/dust-echo.png',
}

/**
 * Build a plausible deep link / web-player url for a track. In the real app
 * these come from each platform's API. Playback = launching these, never
 * streaming audio inside Kaali Billi.
 */
function urlFor(platform: PlatformId, externalId: string): string {
  switch (platform) {
    case 'spotify':
      return `https://open.spotify.com/track/${externalId}`
    case 'youtube':
      return `https://music.youtube.com/watch?v=${externalId}`
    case 'soundcloud':
      return `https://soundcloud.com/${externalId}`
  }
}

function track(
  platform: PlatformId,
  externalId: string,
  title: string,
  artist: string,
  album: string,
  duration: number,
  cover: string,
  liked = true,
): Track {
  return {
    id: `${platform}:${externalId}`,
    externalId,
    title,
    artist,
    album,
    duration,
    platform,
    cover,
    url: urlFor(platform, externalId),
    liked,
  }
}

export const TRACKS: Track[] = [
  // --- Spotify ---
  track('spotify', '3k1a2b9c', 'Midnight Tape', 'Lo Ferro', 'After Hours', 214, COVERS.midnight),
  track('spotify', '7d2e5f1g', 'Neon District', 'Kavya Rao', 'City Lights', 251, COVERS.neon),
  track('spotify', '9h4i8j2k', 'Golden Hour', 'The Marigolds', 'Sunfield', 198, COVERS.golden),
  track('spotify', '2l6m9n3o', 'Concrete Bloom', 'Ash & Ivy', 'Grey Gardens', 233, COVERS.concrete),
  track('spotify', '5p8q1r4s', 'Deep Current', 'Ocean Static', 'Tidal', 305, COVERS.deep, false),
  track('spotify', '1t3u7v0w', 'Paper Moon', 'Nina Halcyon', 'Cutouts', 176, COVERS.paper, false),
  track('spotify', '8x2y6z9a', 'Velvet Room', 'Blue Note Cartel', 'Smoke', 289, COVERS.velvet),

  // --- YouTube Music --- (note: some overlap with Spotify for dedupe demo)
  track('youtube', 'yt_MJ2kd91', 'Midnight Tape', 'Lo Ferro', 'After Hours (Live)', 220, COVERS.midnight),
  track('youtube', 'yt_9fKd02x', 'Static Signal', 'Circuit Ghost', 'Interference', 242, COVERS.static),
  track('youtube', 'yt_qLm83Zp', 'High Wire', 'Paloma Reyes', 'Balance', 201, COVERS.highwire),
  track('youtube', 'yt_bV72naC', 'Golden Hour', 'The Marigolds', 'Sunfield (Acoustic)', 205, COVERS.golden),
  track('youtube', 'yt_x0Pd44m', 'Dust Echo', 'Slow Halo', 'Reverb Diaries', 318, COVERS.dust, false),
  track('youtube', 'yt_kR91mQe', 'Neon District', 'Kavya Rao', 'City Lights', 249, COVERS.neon, false),

  // --- SoundCloud ---
  track('soundcloud', 'circuit-ghost/static-signal', 'Static Signal', 'Circuit Ghost', 'Interference', 238, COVERS.static),
  track('soundcloud', 'slow-halo/dust-echo-vip', 'Dust Echo (VIP Mix)', 'Slow Halo', 'Reverb Diaries', 344, COVERS.dust),
  track('soundcloud', 'ocean-static/deep-current', 'Deep Current', 'Ocean Static', 'Tidal', 301, COVERS.deep),
  track('soundcloud', 'blue-note-cartel/velvet-room', 'Velvet Room', 'Blue Note Cartel', 'Smoke', 292, COVERS.velvet, false),
  track('soundcloud', 'nina-halcyon/paper-moon', 'Paper Moon', 'Nina Halcyon', 'Cutouts', 179, COVERS.paper),
  track('soundcloud', 'paloma-reyes/high-wire-edit', 'High Wire (Edit)', 'Paloma Reyes', 'Balance', 188, COVERS.highwire, false),
]

export const SOURCE_PLAYLISTS: SourcePlaylist[] = [
  {
    id: 'spotify:pl:liked',
    name: 'Liked Songs',
    platform: 'spotify',
    trackCount: 342,
    cover: COVERS.midnight,
    url: 'https://open.spotify.com/collection/tracks',
  },
  {
    id: 'spotify:pl:focus',
    name: 'Deep Focus',
    platform: 'spotify',
    trackCount: 58,
    cover: COVERS.deep,
    url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ',
  },
  {
    id: 'youtube:pl:supermix',
    name: 'Your Supermix',
    platform: 'youtube',
    trackCount: 100,
    cover: COVERS.neon,
    url: 'https://music.youtube.com/playlist?list=RDTMAK5uy',
  },
  {
    id: 'youtube:pl:liked',
    name: 'Liked Music',
    platform: 'youtube',
    trackCount: 211,
    cover: COVERS.golden,
    url: 'https://music.youtube.com/playlist?list=LM',
  },
  {
    id: 'soundcloud:pl:likes',
    name: 'Likes',
    platform: 'soundcloud',
    trackCount: 129,
    cover: COVERS.static,
    url: 'https://soundcloud.com/you/likes',
  },
  {
    id: 'soundcloud:pl:latenight',
    name: 'Late Night Uploads',
    platform: 'soundcloud',
    trackCount: 47,
    cover: COVERS.velvet,
    url: 'https://soundcloud.com/you/sets/late-night',
  },
]

/** Normalize a title + artist into a dedupe key. */
export function dedupeKey(t: Track): string {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/\(.*?\)/g, '') // drop "(Live)", "(Acoustic)" etc.
      .replace(/\[.*?\]/g, '')
      .replace(/\s*-\s*(vip|edit|mix|remix|remaster).*/i, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
  return `${clean(t.title)}::${clean(t.artist)}`
}

export interface MergedTrack {
  key: string
  /** The representative track shown (first connected source). */
  primary: Track
  /** All source variants that collapsed into this row. */
  sources: Track[]
}

/**
 * Merge liked songs across connected platforms into one deduped list.
 */
export function buildMasterLibrary(
  tracks: Track[],
  connected: Set<PlatformId>,
): MergedTrack[] {
  const map = new Map<string, MergedTrack>()
  for (const t of tracks) {
    if (!connected.has(t.platform)) continue
    const key = dedupeKey(t)
    const existing = map.get(key)
    if (existing) {
      existing.sources.push(t)
    } else {
      map.set(key, { key, primary: t, sources: [t] })
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    a.primary.title.localeCompare(b.primary.title),
  )
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
