import { configureStore } from '@reduxjs/toolkit'
import tracksReducer from './slices/tracksSlice'
import playlistsReducer from './slices/playlistsSlice'
import favoritesReducer from './slices/favoritesSlice'
import playerReducer from './slices/playerSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    tracks: tracksReducer,
    playlists: playlistsReducer,
    favorites: favoritesReducer,
    player: playerReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
