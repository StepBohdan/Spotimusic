import React, { useState, useRef, useEffect } from 'react'
import { useAppSelector } from '../store/hooks'
import type { Track, Playlist } from '../types/music'
import TrackListItem from '../components/TrackListItem/TrackListItem'
import PlaylistControls from '../components/PlaylistControls/PlaylistControls'
import type { AuthUser } from '../api/auth'
import { FAVORITES_PLAYLIST_ID } from '../store/slices/playlistsSlice'
import './PlaylistPage.css'

interface PlaylistPageProps {
  user: AuthUser | null
  playlist: Playlist | undefined
  allTracks: Track[]
  playlists: Playlist[]
  onTrackSelect: (track: Track) => void
  onAddToPlaylist: (trackId: string | number, playlistId: number) => void
  onRemoveFromPlaylist: (trackId: string | number, playlistId: number) => void
  onRenamePlaylist?: (playlistId: number, newName: string) => void
  onDeletePlaylist?: (playlistId: number) => void
}

const PlaylistPage: React.FC<PlaylistPageProps> = ({
  user,
  playlist,
  playlists,
  onTrackSelect,
  onRemoveFromPlaylist,
  onAddToPlaylist,
  onRenamePlaylist,
  onDeletePlaylist,
}) => {
  const currentTrack = useAppSelector((state) => state.player.currentTrack)
  const isPlaying = useAppSelector((state) => state.player.isPlaying)
  const [showPlaylistOptionsMenu, setShowPlaylistOptionsMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handlePlaylistOptions = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowPlaylistOptionsMenu(!showPlaylistOptionsMenu)
  }

  const closePlaylistOptionsMenu = () => {
    setShowPlaylistOptionsMenu(false)
  }

  const handleRenamePlaylist = () => {
    if (playlist) {
      const newName = window.prompt('Enter new playlist name:', playlist.name)
      if (newName && newName.trim() && onRenamePlaylist) {
        onRenamePlaylist(playlist.id, newName.trim())
      }
    }
    closePlaylistOptionsMenu()
  }

  const handleDeletePlaylist = () => {
    if (playlist && window.confirm('Are you sure you want to delete this playlist?')) {
      if (onDeletePlaylist) {
        onDeletePlaylist(playlist.id)
      }
    }
    closePlaylistOptionsMenu()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowPlaylistOptionsMenu(false)
      }
    }

    if (showPlaylistOptionsMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPlaylistOptionsMenu])
  if (!playlist) {
    return (
      <div className="main-wrapper">
        <div className="main-screen">
          <h1 className="main-title">Playlist not found</h1>
        </div>
      </div>
    )
  }

  const tracksCount = playlist.tracks.length

  return (
    <div className="main-wrapper" onClick={closePlaylistOptionsMenu}>
      <div className="main-screen">
        <div className="playlist-header">
          <div className="playlist-cover">
            <div
              className="playlist-cover-gradient"
              style={{ background: playlist.cover || 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }}
            />
          </div>
          <div className="playlist-meta">
            <span className="playlist-type">Playlist</span>
            <h1 className="playlist-title">{playlist.name}</h1>
            <div className="playlist-subtitle">
              <span>{user?.username || "Spotimusic"}</span>
              <span className="dot">•</span>
              <span>{tracksCount} tracks</span>
            </div>
          </div>
          {playlist.id !== FAVORITES_PLAYLIST_ID && (
            <div className="playlist-header-settings">
              <button
                type="button"
                className="playlist-page-settings-btn"
                onClick={handlePlaylistOptions}
              >
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                  <path fill="#ffffff" d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z"></path>
                </svg>
              </button>
              {showPlaylistOptionsMenu && (
                <div ref={menuRef} className="playlist-options-menu" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="playlist-option-item"
                    onClick={handleRenamePlaylist}
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    className="playlist-option-item delete"
                    onClick={handleDeletePlaylist}
                  >
                    Delete playlist
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <PlaylistControls playlist={playlist} onTrackSelect={onTrackSelect} />

        <div className="tracks-list-container">
          <div className="tracks-list-header">
            <div className="tracks-list-header-col number">#</div>
            <div className="tracks-list-header-col title">Title</div>
            <div className="tracks-list-header-col author">Author</div>
            <div className="tracks-list-header-col date">Date</div>
          </div>
          <div className="tracks-list">
            {playlist.tracks.map((item, index) => {
              const track = typeof item === 'object' && 'track' in item ? item.track : item
              const dateAdded = typeof item === 'object' && 'dateAdded' in item ? item.dateAdded : undefined
              const trackId = typeof item === 'object' && 'track' in item ? item.track.id : item.id
              const isSelected = currentTrack?.id === trackId
              
              return (
                <TrackListItem
                  key={trackId}
                  track={track}
                  index={index}
                  playlistId={playlist.id}
                  dateAdded={dateAdded}
                  selected={isSelected}
                  isPlaying={isSelected && isPlaying}
                  playlists={playlists.filter(p => p.id !== playlist.id)}
                  onSelect={() => onTrackSelect(track)}
                  onRemoveFromPlaylist={onRemoveFromPlaylist}
                  onAddToPlaylist={onAddToPlaylist}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaylistPage

