export interface Track {
  id: string | number
  name: string
  artist: string
  image?: string
  preview_url?: string
  audioUrl?: string
  album?: string
  duration?: number
}

export interface PlaylistTrack {
  track: Track
  dateAdded?: number
}

export interface Playlist {
  id: number
  name: string
  tracks: Array<Track | PlaylistTrack>
  cover?: string
}

export const getPlaylistTracks = (playlist: Playlist): Track[] => {
  return playlist.tracks.map((item) =>
    typeof item === 'object' && 'track' in item ? item.track : item
  )
}

