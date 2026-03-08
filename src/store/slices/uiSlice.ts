import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '../../api/auth'

interface UiState {
  activeTab: 'home' | 'playlists' | 'favorites'
  searchQuery: string
  user: AuthUser | null
}

const initialState: UiState = {
  activeTab: 'home',
  searchQuery: '',
  user: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'home' | 'playlists' | 'favorites'>) => {
      state.activeTab = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload
    },
  },
})

export const { setActiveTab, setSearchQuery, setUser } = uiSlice.actions
export default uiSlice.reducer
