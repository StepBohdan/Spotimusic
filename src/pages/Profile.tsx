import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import type { AuthUser } from '../api/auth'
import type { Track, Playlist, PlaylistTrack } from '../types/music'
import { FAVORITES_PLAYLIST_ID } from '../store/slices/playlistsSlice'
import TrackCard from '../components/TrackCard/TrackCard'
import './Profile.css'

interface ProfileProps {
  user: AuthUser | null
  favoriteTracks: PlaylistTrack[]
  playlists: Playlist[]
  allTracks: Track[]
  onTabChange: (tab: 'home' | 'playlists' | 'favorites', playlistId?: number) => void,
  onTrackSelect: (track: Track) => void
  onAddToPlaylist: (trackId: string | number, playlistId: number) => void
  onRemoveFromPlaylist: (trackId: string | number, playlistId: number) => void
  onRenamePlaylist?: (playlistId: number, newName: string) => void
  onDeletePlaylist?: (playlistId: number) => void
}

const Profile: React.FC<ProfileProps> = ({
  user,
  favoriteTracks,
  playlists,
  allTracks,
  onTabChange,
  onTrackSelect,
  onRenamePlaylist,
  onDeletePlaylist,
}) => {
  const navigate = useNavigate()
  const [showPlaylistOptionsMenu, setShowPlaylistOptionsMenu] = React.useState<number | null>(null)
  const currentTrack = useAppSelector((state) => state.player.currentTrack)
  const isPlaying = useAppSelector((state) => state.player.isPlaying)

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <p>You are not authorized</p>
          <button onClick={() => navigate('/')}>Return to home</button>
        </div>
      </div>
    )
  }

  const favoriteTrackIds = favoriteTracks.map(item => item.track.id)
  const favoriteTracksList = allTracks.filter((track) => favoriteTrackIds.includes(track.id))
  const userPlaylists = playlists
  const initial = (user.username || '?').charAt(0).toUpperCase()



  const closePlaylistOptionsMenu = () => {
    setShowPlaylistOptionsMenu(null)
  }

  const handleRenamePlaylist = (playlistId: number) => {
    const playlist = playlists.find(p => p.id === playlistId)
    if (playlist) {
      const newName = window.prompt('Enter new playlist name:', playlist.name)
      if (newName && newName.trim() && onRenamePlaylist) {
        onRenamePlaylist(playlistId, newName.trim())
      }
    }
    closePlaylistOptionsMenu()
  }

  const handleDeletePlaylist = (playlistId: number) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      if (onDeletePlaylist) {
        onDeletePlaylist(playlistId)
      }
    }
    closePlaylistOptionsMenu()
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span>{initial}</span>
        </div>
        <div className="profile-info">
          <h1 className="profile-username">{user.username || 'Profile'}</h1>
        </div>
      </div>

      <div className="profile-content">
        <section className="profile-section">
          <h2 className="profile-section-title">Favorite tracks</h2>
          {favoriteTracksList.length > 0 ? (
            <div className="profile-tracks-grid">
              {favoriteTracksList.map((track) => {
               
                const isSelected = currentTrack?.id === track.id
                return (
                  <TrackCard
                    key={track.id}
                    track={track}
                    selected={isSelected}
                    isPlaying={isSelected && isPlaying}
                    onSelect={() => onTrackSelect(track)}
                  />
                )
              })}
            </div>
          ) : (
            <div className="profile-empty-state">
              <p>You don't have any favorite tracks yet</p>
            </div>
          )}
        </section>

        <section className="profile-section">
          <h2 className="profile-section-title">My playlists</h2>
          {userPlaylists.length > 0 ? (
            <div className="profile-playlists-grid">
              {userPlaylists.map((playlist) => (
                <div 
                  key={playlist.id} 
                  className="profile-playlist-card"
                  onClick={() => onTabChange('playlists', playlist.id)}
                >
                  <div className="profile-playlist-image">
                    <div 
                      className="profile-playlist-image-placeholder"
                      style={{ background: playlist.cover || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                    </div>
                  </div>
                  <div className="profile-playlist-info">
                    <h3 className="profile-playlist-name">{playlist.name}</h3>
                    <p className="profile-playlist-count">{playlist.tracks.length} tracks</p>
                  </div>
                  {showPlaylistOptionsMenu === playlist.id && playlist.id !== FAVORITES_PLAYLIST_ID && (
                    <div className="playlist-options-menu" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="playlist-option-item"
                        onClick={handleRenamePlaylist.bind(null, playlist.id)}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        className="playlist-option-item delete"
                        onClick={handleDeletePlaylist.bind(null, playlist.id)}
                      >
                        Delete playlist
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="profile-empty-state">
              <p>You don't have any playlists yet</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Profile
