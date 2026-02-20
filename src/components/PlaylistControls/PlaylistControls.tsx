import React from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { Playlist, Track } from '../../types/music'
import { requestPlay, requestPause, cyclePlaybackMode } from '../../store/slices/playerSlice'
import IconButton from '../IconButton/IconButton'

interface PlaylistControlsProps {
  playlist: Playlist
  onTrackSelect: (track: Track) => void
}

const PlaylistControls: React.FC<PlaylistControlsProps> = ({ playlist, onTrackSelect }) => {
  const dispatch = useAppDispatch()
  const currentTrack = useAppSelector((state) => state.player.currentTrack)
  const isPlaying = useAppSelector((state) => state.player.isPlaying)
  const playbackMode = useAppSelector((state) => state.player.playbackMode)
  const tracksCount = playlist.tracks.length

  if (tracksCount === 0) {
    return null
  }

  const isCurrentTrackInPlaylist = playlist.tracks.some((item) => {
    const track = typeof item === 'object' && 'track' in item ? item.track : item
    return currentTrack && track.id === currentTrack.id
  })

  const isPlaylistPlaying = isCurrentTrackInPlaylist && isPlaying

  const handlePlaylistPlayClick = () => {
    if (!playlist || playlist.tracks.length === 0) return

    if (isCurrentTrackInPlaylist) {
      if (isPlaying) {
        dispatch(requestPause())
      } else {
        dispatch(requestPlay())
      }
      return
    }

    const firstItem = playlist.tracks[0]
    const firstTrack = typeof firstItem === 'object' && 'track' in firstItem ? firstItem.track : firstItem
    onTrackSelect(firstTrack)
  }

  const handleCyclePlaybackMode = () => {
    dispatch(cyclePlaybackMode())
  }

  return (
    <div className="playlist-controls-row">
      <div className="playlist-controls-left">
        <IconButton
          variant={isPlaylistPlaying ? 'pause' : 'play'}
          className={`playlist-play-btn ${isPlaylistPlaying ? 'playing' : ''}`}
          onClick={handlePlaylistPlayClick}
          ariaLabel={isPlaylistPlaying ? 'Pause playlist' : 'Play playlist'}
        />

        <IconButton
          variant={
            playbackMode === 'shuffle'
              ? 'shuffle'
              : playbackMode === 'repeat-one'
              ? 'repeat-one'
              : 'repeat'
          }
          className={`playlist-repeat-btn ${playbackMode !== 'sequential' ? 'active' : ''}`}
          onClick={handleCyclePlaybackMode}
          ariaLabel={
            playbackMode === 'shuffle'
              ? 'Shuffle playback mode'
              : playbackMode === 'repeat-one'
              ? 'Repeat one mode'
              : 'Sequential playback mode'
          }
        />
      </div>
    </div>
  )
}

export default PlaylistControls
