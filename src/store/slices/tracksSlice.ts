import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Track } from '../../types/music'

interface TracksState {
  allTracks: Track[]
  shuffledTracks: Track[]
  loading: boolean
  error: string | null
}

const initialState: TracksState = {
  allTracks: [],
  shuffledTracks: [],
  loading: true,
  error: null,
}

const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setTracks: (state, action: PayloadAction<Track[]>) => {
      state.allTracks = action.payload
      state.loading = false
      state.error = null

      if (state.shuffledTracks.length === 0 && action.payload.length > 0) {
        const shuffled = [...action.payload].sort(() => Math.random() - 0.5)
        state.shuffledTracks = shuffled.slice(0, 60)
      }
    },
    setShuffledTracks: (state, action: PayloadAction<Track[]>) => {
      state.shuffledTracks = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setTracks, setShuffledTracks, setLoading, setError } = tracksSlice.actions
export default tracksSlice.reducer
