import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { PlaylistTrack } from '../../types/music'

const FAVORITES_STORAGE_KEY = 'spotimusic_favorite_tracks'

const getStoredFavoriteTracks = (): PlaylistTrack[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

interface FavoritesState {
  favoriteTracks: PlaylistTrack[]
}

const initialState: FavoritesState = {
  favoriteTracks: getStoredFavoriteTracks(),
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavoriteTracks: (state, action: PayloadAction<PlaylistTrack[]>) => {
      state.favoriteTracks = action.payload
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(action.payload))
    },
    addToFavorites: (state, action: PayloadAction<PlaylistTrack>) => {
      // Check if track already exists
      const trackExists = state.favoriteTracks.some(
        (item) => item.track.id === action.payload.track.id
      )
      if (!trackExists) {
        state.favoriteTracks.push(action.payload)
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.favoriteTracks))
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string | number>) => {
      state.favoriteTracks = state.favoriteTracks.filter(
        (item) => item.track.id !== action.payload
      )
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.favoriteTracks))
    },
  },
})

export const { setFavoriteTracks, addToFavorites, removeFromFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
