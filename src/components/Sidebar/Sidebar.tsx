import { useState } from 'react'
import type { Playlist } from '../../types/music'
import './Sidebar.css'

interface SidebarProps {
  activeTab: 'home' | 'playlists' | 'favorites'
  onTabChange: (tab: 'home' | 'playlists' | 'favorites', playlistId?: number) => void
  playlists: Playlist[]
  onCreatePlaylist: () => void
}

function Sidebar({ onTabChange, playlists, onCreatePlaylist }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="sidebar">
      <div className="sidebar-panel">
        <div className="sidebar-header">
          <h2
            className="sidebar-logo nav-item"
            onClick={() => onTabChange('home')}
            style={{ cursor: 'pointer' }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M9.772 4.28c.56-.144 1.097.246 1.206.814.1.517-.263 1.004-.771 1.14A7 7 0 1 0 19 12.9c.009-.5.4-.945.895-1 .603-.067 1.112.371 1.106.977L21 13c0 .107-.002.213-.006.32a.898.898 0 0 1 0 .164l-.008.122a9 9 0 0 1-9.172 8.392A9 9 0 0 1 9.772 4.28z" fill="#1db954"></path>
                <path d="M15.93 13.753a4.001 4.001 0 1 1-6.758-3.581A4 4 0 0 1 12 9c.75 0 1.3.16 2 .53 0 0 .15.09.25.17-.1-.35-.228-1.296-.25-1.7a58.75 58.75 0 0 1-.025-2.035V2.96c0-.52.432-.94.965-.94.103 0 .206.016.305.048l4.572 1.689c.446.145.597.23.745.353.148.122.258.27.33.446.073.176.108.342.108.801v1.16c0 .518-.443.94-.975.94a.987.987 0 0 1-.305-.049l-1.379-.447-.151-.05c-.437-.14-.618-.2-.788-.26a5.697 5.697 0 0 1-.514-.207 3.53 3.53 0 0 1-.213-.107c-.098-.05-.237-.124-.521-.263L16 6l.011 7c0 .255-.028.507-.082.753h.001z" fill="#1db954"></path>
              </g>
            </svg>
            <span style={{ marginLeft: '8px' }}>Spotimusic</span>
          </h2>
        </div>

        <div className="sidebar-playlists">
          <div className="playlists-header">
            <h3 className="playlists-title">Your Library</h3>
          </div>

          <div className="sidebar-search">
            <span className="sidebar-search-icon"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M15 10.5C15 12.9853 12.9853 15 10.5 15C8.01472 15 6 12.9853 6 10.5C6 8.01472 8.01472 6 10.5 6C12.9853 6 15 8.01472 15 10.5ZM14.1793 15.2399C13.1632 16.0297 11.8865 16.5 10.5 16.5C7.18629 16.5 4.5 13.8137 4.5 10.5C4.5 7.18629 7.18629 4.5 10.5 4.5C13.8137 4.5 16.5 7.18629 16.5 10.5C16.5 11.8865 16.0297 13.1632 15.2399 14.1792L20.0304 18.9697L18.9697 20.0303L14.1793 15.2399Z" fill="#ffffff"></path> </g></svg></span>
            <input
              type="text"
              className="sidebar-search-input"
              placeholder="Search playlists"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="sidebar-create-btn"
            type="button"
            onClick={onCreatePlaylist}
          >
            + Create playlist
          </button>

          <h4 className="playlists-subtitle">Playlists</h4>
          {filteredPlaylists.length > 0 ? (
            <ul className="playlists-list">
              {filteredPlaylists.map((playlist) => (
                <li
                  key={playlist.id}
                  className="playlist-item"
                  onClick={() => onTabChange('playlists', playlist.id)}
                >
                  <div
                    className="playlist-item-cover"
                    style={{ background: playlist.cover || 'linear-gradient(135deg, #404040 0%, #1f1f1f 100%)' }}
                  />
                  <div className="playlist-item-info">
                    <div className="playlist-item-name">{playlist.name}</div>
                    <div className="playlist-item-count">
                      {playlist.tracks.length > 0
                        ? `${playlist.tracks.length} tracks`
                        : playlist.name === 'Favorite tracks' || playlist.name === 'Favorite'
                          ? 'Add tracks to favorites'
                          : 'Empty playlist'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="playlists-empty">
              {playlists.length === 0 && !searchQuery
                ? 'No playlists yet'
                : 'Nothing found'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
