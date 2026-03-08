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
      // Не обновляем состояние, если трек не изменился
      const newTrack = action.payload;
      const currentTrackId = state.currentTrack?.id;
      const newTrackId = newTrack?.id;
      
      // Если оба null или оба имеют одинаковый id, не обновляем
      if (currentTrackId === newTrackId) {
        console.log('setCurrentTrack: Skipping update - same track id:', newTrackId);
        return;
      }
      
      console.log('setCurrentTrack: Updating track from', currentTrackId, 'to', newTrackId);
      state.currentTrack = newTrack;
    },
    setCurrentTrackList: (state, action: PayloadAction<Track[]>) => {
      const newList = action.payload;
      const currentList = state.currentTrackList;
      
      // Не обновляем список, если он не изменился (проверяем по длине и первому элементу)
      if (currentList.length === newList.length && 
          currentList.length > 0 && 
          currentList[0]?.id === newList[0]?.id &&
          currentList[currentList.length - 1]?.id === newList[newList.length - 1]?.id) {
        return;
      }
      
      state.currentTrackList = newList;
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
