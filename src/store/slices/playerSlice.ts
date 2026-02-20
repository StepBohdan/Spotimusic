import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Track } from '../../types/music'

export type PlaybackMode = 'sequential' | 'repeat-one' | 'shuffle'

interface PlayerState {
  currentTrack: Track | null
  currentTrackList: Track[]
  isPlaying: boolean
  playRequested: boolean
  pauseRequested: boolean
  playbackMode: PlaybackMode
}

const initialState: PlayerState = {
  currentTrack: null,
  currentTrackList: [],
  isPlaying: false,
  playRequested: false,
  pauseRequested: false,
  playbackMode: 'sequential',
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track | null>) => {
      state.currentTrack = action.payload
    },
    setCurrentTrackList: (state, action: PayloadAction<Track[]>) => {
      state.currentTrackList = action.payload
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload
    },
    requestPlay: (state) => {
      state.playRequested = true
      state.pauseRequested = false
    },
    requestPause: (state) => {
      state.pauseRequested = true
      state.playRequested = false
    },
    clearPlayPauseRequests: (state) => {
      state.playRequested = false
      state.pauseRequested = false
    },
    cyclePlaybackMode: (state) => {
      if (state.playbackMode === 'sequential') {
        state.playbackMode = 'repeat-one'
      } else if (state.playbackMode === 'repeat-one') {
        state.playbackMode = 'shuffle'
      } else {
        state.playbackMode = 'sequential'
      }
    },
  },
})

export const { setCurrentTrack, setCurrentTrackList, setIsPlaying, requestPlay, requestPause, clearPlayPauseRequests, cyclePlaybackMode } = playerSlice.actions
export default playerSlice.reducer
