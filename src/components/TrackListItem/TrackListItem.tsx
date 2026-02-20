import React, { useState, useRef, useEffect } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { requestPlay, requestPause } from '../../store/slices/playerSlice'
import type { Playlist, Track } from '../../types/music'
import './TrackListItem.css'

interface TrackListItemProps {
  track: Track
  index: number
  playlistId?: number
  dateAdded?: number
  onSelect: () => void
  onRemoveFromPlaylist?: (trackId: string | number, playlistId: number) => void
  onAddToPlaylist?: (trackId: string | number, playlistId: number) => void
  playlists?: Playlist[]
  isPlaying?: boolean,
  selected: boolean
}

const TrackListItem: React.FC<TrackListItemProps> = ({ 
  track, 
  index, 
  playlistId,
  dateAdded,
  onSelect,
  onRemoveFromPlaylist,
  onAddToPlaylist,
  playlists = [],
  isPlaying = false,
  selected,
}) => {
  const dispatch = useAppDispatch()
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selected && isPlaying) {
      dispatch(requestPause())
    } else if (selected && !isPlaying) {
      dispatch(requestPlay())
    } else {
      onSelect()
    }
  }

  const handleItemClick = () => {
    if (selected && isPlaying) {
      dispatch(requestPause())
    } else if (selected && !isPlaying) {
      dispatch(requestPlay())
    } else {
      onSelect()
    }
  }

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowOptionsMenu(!showOptionsMenu)
  }

  const handleRemoveFromPlaylist = () => {
    if (playlistId && onRemoveFromPlaylist) {
      onRemoveFromPlaylist(track.id, playlistId)
    }
    setShowOptionsMenu(false)
  }

  const handlePlaylistSelect = (selectedPlaylistId: number) => {
    if (onAddToPlaylist) {
      onAddToPlaylist(track.id, selectedPlaylistId)
    }
    setShowOptionsMenu(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false)
      }
    }

    if (showOptionsMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showOptionsMenu])

  // Format date added - show time ago
  const formatDateAdded = (timestamp?: number): string => {
    if (!timestamp) return ''
    
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInSeconds = Math.floor(diffInMs / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    const diffInWeeks = Math.floor(diffInDays / 7)
    const diffInMonths = Math.floor(diffInDays / 30)
    const diffInYears = Math.floor(diffInDays / 365)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`
    } else if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
    } else {
      return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
    }
  }

  return (
    <div 
      className="track-list-item" 
      onClick={handleItemClick}
    >
      <div className="track-list-number">{index + 1}</div>
      <div className="track-list-image">
        {track.image ? (
          <img src={track.image} alt={track.name} />
        ) : (
          <div className="track-list-image-placeholder">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        )}
      </div>
      <div className="track-list-info" >
        <div className="track-list-name">{track.name}</div>
      </div>
      <div className="track-list-artist-col">{track.artist}</div>
      <div className="track-list-date-col">
        {dateAdded ? formatDateAdded(dateAdded) : ''}
      </div>
      <div className="track-list-actions">
        <button
          type="button"
          className="track-list-play-btn"
          onClick={handlePlayClick}
          aria-label="Play"
        >
          {selected && isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        <button
          type="button"
          className="track-list-options-btn"
          onClick={handleOptionsClick}
          aria-label="Options"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="5" r="1.5"/>
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
        {showOptionsMenu && (
          <div ref={menuRef} className="track-list-options-menu" onClick={(e) => e.stopPropagation()}>
            {playlists.length > 0 && onAddToPlaylist && (
              <div className="track-list-option-submenu">
                <div className="track-list-option-label">Add to playlist:</div>
                {playlists.map((playlist) => {
                  const playlistTracks = playlist.tracks.map(item => 
                    typeof item === 'object' && 'track' in item ? item.track : item
                  )
                  const isInPlaylist = playlistTracks.some((t: Track) => t.id === track.id)
                  
                  return (
                    <button
                      key={playlist.id}
                      type="button"
                      className={`track-list-option-item ${isInPlaylist ? 'in-playlist' : ''}`}
                      onClick={() => {
                        if (!isInPlaylist) {
                          handlePlaylistSelect(playlist.id)
                        }
                      }}
                      disabled={isInPlaylist}
                    >
                      {isInPlaylist ? `${playlist.name}` : playlist.name}
                    </button>
                  )
                })}
              </div>
            )}
            {playlistId && onRemoveFromPlaylist && (
              <>
                {playlists.length > 0 && onAddToPlaylist && (
                  <div className="track-list-option-divider"></div>
                )}
                <button
                  type="button"
                  className="track-list-option-item delete"
                  onClick={handleRemoveFromPlaylist}
                >
                  Remove from playlist
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackListItem
