import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Playlist, Track, PlaylistTrack } from '../../types/music'

export const FAVORITES_PLAYLIST_ID = 1
const PLAYLISTS_STORAGE_KEY = 'spotimusic_playlists'
export const DEFAULT_FAVORITES_COVER = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
export const PLAYLIST_COVERS = [
  'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)',
  'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
  'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  'linear-gradient(135deg, #1d976c 0%, #93f9b9 100%)',
]

export const getRandomPlaylistCover = () => {
  return PLAYLIST_COVERS[Math.floor(Math.random() * PLAYLIST_COVERS.length)]
}

const getStoredPlaylists = (): Playlist[] => {
  try {
    const raw = localStorage.getItem(PLAYLISTS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((playlist) => playlist && typeof playlist === 'object')
      .map((playlist) => ({
        id: Number(playlist.id),
        name: typeof playlist.name === 'string' ? playlist.name : 'New playlist',
        cover: typeof playlist.cover === 'string' ? playlist.cover : undefined,
        tracks: Array.isArray(playlist.tracks) ? playlist.tracks : [],
      }))
      .filter((playlist) => Number.isFinite(playlist.id) && playlist.id !== FAVORITES_PLAYLIST_ID)
  } catch {
    return []
  }
}

interface PlaylistsState {
  playlists: Playlist[]
}

const initialState: PlaylistsState = {
  playlists: [
    {
      id: FAVORITES_PLAYLIST_ID,
      name: 'Favorite',
      tracks: [],
      cover: DEFAULT_FAVORITES_COVER,
    },
    ...getStoredPlaylists(),
  ],
}

const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    setPlaylists: (state, action: PayloadAction<Playlist[]>) => {
      state.playlists = action.payload
      const customPlaylists = action.payload.filter(
        (playlist) => playlist.id !== FAVORITES_PLAYLIST_ID
      )
      localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(customPlaylists))
    },
    addPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.playlists.push(action.payload)
      const customPlaylists = state.playlists.filter(
        (playlist) => playlist.id !== FAVORITES_PLAYLIST_ID
      )
      localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(customPlaylists))
    },
    updatePlaylist: (state, action: PayloadAction<Playlist>) => {
      const index = state.playlists.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.playlists[index] = action.payload
        const customPlaylists = state.playlists.filter(
          (playlist) => playlist.id !== FAVORITES_PLAYLIST_ID
        )
        localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(customPlaylists))
      }
    },
    updateFavoritesPlaylist: (state, action: PayloadAction<{ tracks: Track[] }>) => {
      const favoritesIndex = state.playlists.findIndex((p) => p.id === FAVORITES_PLAYLIST_ID)
      if (favoritesIndex !== -1) {
        
        // Use current timestamp for dateAdded if not provided
        state.playlists[favoritesIndex].tracks = action.payload.tracks.map(track => ({
          track,
          dateAdded: Date.now()
        }))
      }
    },
    updateFavoritesPlaylistFromPlaylistTracks: (state, action: PayloadAction<{ tracks: Array<{ track: Track; dateAdded?: number }> }>) => {
      const favoritesIndex = state.playlists.findIndex((p) => p.id === FAVORITES_PLAYLIST_ID)
      if (favoritesIndex !== -1) {
        state.playlists[favoritesIndex].tracks = action.payload.tracks
      }
    },
    addTrackToPlaylist: (state, action: PayloadAction<{ trackId: string | number; playlistId: number; track: Track }>) => {
      const playlist = state.playlists.find((p) => p.id === action.payload.playlistId)
      if (playlist) {
        // Check if track already exists (handle both Track and PlaylistTrack formats)
        const trackExists = playlist.tracks.some((t) => {
          const trackId = typeof t === 'object' && 'track' in t ? t.track.id : t.id
          return trackId === action.payload.trackId
        })
        if (!trackExists) {
          const playlistTrack: PlaylistTrack = {
            track: action.payload.track,
            dateAdded: Date.now()
          }
          playlist.tracks.push(playlistTrack)
          const customPlaylists = state.playlists.filter(
            (p) => p.id !== FAVORITES_PLAYLIST_ID
          )
          localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(customPlaylists))
        }
      }
    },
    removeTrackFromPlaylist: (state, action: PayloadAction<{ trackId: string | number; playlistId: number }>) => {
      const playlist = state.playlists.find((p) => p.id === action.payload.playlistId)
      if (playlist) {
        playlist.tracks = playlist.tracks.filter((t) => {
          const trackId = typeof t === 'object' && 'track' in t ? t.track.id : t.id
          return trackId !== action.payload.trackId
        })
        const customPlaylists = state.playlists.filter(
          (p) => p.id !== FAVORITES_PLAYLIST_ID
        )
        localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(customPlaylists))
      }
    },
    renamePlaylist: (state, action: PayloadAction<{ playlistId: number; newName: string }>) => {
      const playlist = state.playlists.find((p) => p.id === action.payload.playlistId)
      if (playlist && playlist.id !== FAVORITES_PLAYLIST_ID) {
        playlist.name = action.payload.newName
        const customPlaylists = state.playlists.filter(
          (p) => p.id !== FAVORITES_PLAYLIST_ID
        )
        localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(customPlaylists))
      }
    },
    deletePlaylist: (state, action: PayloadAction<number>) => {
      if (action.payload !== FAVORITES_PLAYLIST_ID) {
        state.playlists = state.playlists.filter((p) => p.id !== action.payload)
        const customPlaylists = state.playlists.filter(
          (p) => p.id !== FAVORITES_PLAYLIST_ID
        )
        localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(customPlaylists))
      }
    },
  },
})


export const { setPlaylists, addPlaylist, updatePlaylist, updateFavoritesPlaylist, updateFavoritesPlaylistFromPlaylistTracks, addTrackToPlaylist, removeTrackFromPlaylist, renamePlaylist, deletePlaylist } = playlistsSlice.actions
export default playlistsSlice.reducer
