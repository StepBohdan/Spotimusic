import React from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice'
import { requestPlay, requestPause } from '../../store/slices/playerSlice'
import IconButton from '../IconButton/IconButton'
import type { Track } from '../../types/music'
import './TrackCard.css'

interface TrackCardProps {
  track: Track
  onSelect: () => void
  selected: boolean
  isPlaying?: boolean
}

const TrackCard: React.FC<TrackCardProps> = ({
  track,
  onSelect,
  selected,
  isPlaying = false,
}) => {
  const dispatch = useAppDispatch()
  const favoriteTracks = useAppSelector((state) => state.favorites.favoriteTracks)
  const isFavorite = favoriteTracks.some(item => item.track.id === track.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFavorite) {
      dispatch(removeFromFavorites(track.id))
    } else {
      dispatch(addToFavorites({ track, dateAdded: Date.now() }))
    }
  }

  const handleCardClick = () => {
    if (selected && isPlaying) {
      dispatch(requestPause())
    } else if (selected && !isPlaying) {
      dispatch(requestPlay())
    } else {
      onSelect()
    }
  }

  return (
    <div
      className="track-card"
      onClick={handleCardClick}
    >
      <div className="track-image">
        <IconButton
          variant="favorite"
          className="track-playlist-btn"
          active={isFavorite}
          onClick={handleFavoriteClick}
          ariaLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        />
        {track.image ? (
          <>
            <img
              src={track.image}
              alt={track.name}
              className="track-image-img"
            />
            <div className="track-play-overlay">
              <div className="track-play-button">
                <IconButton
                  variant={selected && isPlaying ? 'pause' : 'play'}
                  ariaLabel={selected && isPlaying ? 'Pause track' : 'Play track'}
                />
              </div>
            </div>
          </>
        ) : (
            <div className="track-image-placeholder">
            <div className="track-play-overlay">
              <div className="track-play-button">
                <IconButton
                  variant={selected && isPlaying ? 'pause' : 'play'}
                  ariaLabel={selected && isPlaying ? 'Pause track' : 'Play track'}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="track-info">
        <h3 className="track-name">{track.name}</h3>
        <p className="track-artist">{track.artist}</p>
      </div>
    </div>
  )
}

export default TrackCard
