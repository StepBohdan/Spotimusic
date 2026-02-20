import { useMemo, useRef, useState, useEffect } from 'react'
import { useAppSelector } from '../../store/hooks'
import './MainScreen.css'
import TrackCard from '../TrackCard/TrackCard'


import type { Track, Playlist, PlaylistTrack } from '../../types/music'

interface MainScreenProps {
  activeTab: 'home' | 'playlists' | 'favorites'
  playlists: Playlist[]
  onCreatePlaylist: (name: string) => void
  favoriteTracks: PlaylistTrack[]
  allTracks: Track[]
  error?: string | null
  loading?: boolean
  onTrackSelect: (track: Track) => void
  searchQuery: string
  onPlaylistClick?: (playlistId: number) => void
}

function MainScreen({ 
  activeTab, 
  playlists, 
  favoriteTracks,
  allTracks,
  error,
  loading = false,
  onTrackSelect,
  searchQuery,
  onPlaylistClick,
}: MainScreenProps) {
  const [scrollableSections, setScrollableSections] = useState<boolean[]>([])
  const sectionRefs = useRef<HTMLDivElement[]>([])
  
  
  const shuffledTracksFromStore = useAppSelector((state) => state.tracks.shuffledTracks)
  const currentTrack = useAppSelector((state) => state.player.currentTrack)
  const isPlaying = useAppSelector((state) => state.player.isPlaying)
  
  const randomTracks = useMemo(() => {
    // Redux shuffled tracks
    if (shuffledTracksFromStore.length > 0) {
      return shuffledTracksFromStore
    }
    // Regular tracks
    return allTracks
  }, [shuffledTracksFromStore, allTracks])


  const filteredFavoriteTracks = useMemo(() => {
    const favoriteTrackIds = favoriteTracks.map(item => item.track.id)
    const base = allTracks.filter(t => favoriteTrackIds.includes(t.id))
    if (!searchQuery.trim()) return base

    const query = searchQuery.toLowerCase()
    return base.filter(track =>
      track.name.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query)
    )
  }, [allTracks, favoriteTracks, searchQuery])

  const filteredPlaylists = useMemo(() => {
    return playlists
  }, [playlists])

  const homeSections = useMemo(() => {
    const sectionTracks = [
      randomTracks.slice(0, 15),   // Chill & Lo-Fi
      randomTracks.slice(15, 30),  // Pop Hits
      randomTracks.slice(30, 45),  // Electronic & Dance
      randomTracks.slice(45, 60),  // Hip-Hop & Rap
    ]


    const query = searchQuery.trim() ? searchQuery.toLowerCase() : null
    
    const sections = [
      {
        title: 'Chill & Lo-Fi',
        tracks: query
          ? sectionTracks[0].filter(track =>
              track.name.toLowerCase().includes(query) ||
              track.artist.toLowerCase().includes(query)
            )
          : sectionTracks[0],
      },
      {
        title: 'Pop Hits',
        tracks: query
          ? sectionTracks[1].filter(track =>
              track.name.toLowerCase().includes(query) ||
              track.artist.toLowerCase().includes(query)
            )
          : sectionTracks[1],
      },
      {
        title: 'Electronic & Dance',
        tracks: query
          ? sectionTracks[2].filter(track =>
              track.name.toLowerCase().includes(query) ||
              track.artist.toLowerCase().includes(query)
            )
          : sectionTracks[2],
      },
      {
        title: 'Hip-Hop & Rap',
        tracks: query
          ? sectionTracks[3].filter(track =>
              track.name.toLowerCase().includes(query) ||
              track.artist.toLowerCase().includes(query)
            )
          : sectionTracks[3],
      },
    ]

    return sections.filter(section => section.tracks.length > 0)
  }, [randomTracks, searchQuery])
  
  // Check if scroll is needed for each section
  useEffect(() => {
    if (activeTab !== 'home') return
    
    const checkScrollable = () => {
      const scrollable = sectionRefs.current.map((el) => {
        if (!el) return false
        return el.scrollWidth > el.clientWidth + 1 
      })
      setScrollableSections(scrollable)
    }
    
    const timeoutId = setTimeout(checkScrollable, 150)
    
    window.addEventListener('resize', checkScrollable)
    
    return () => {
      window.removeEventListener('resize', checkScrollable)
      clearTimeout(timeoutId)
    }
  }, [homeSections, activeTab])

  const getContent = () => {
    switch (activeTab) {
      case 'home':
        return {
          title: 'Recommended',
        }
      case 'favorites':
        return {
          title: 'Favorite',
          tracks: filteredFavoriteTracks,
        }
      default:
        return {
          title: 'My playlists',
        }
    }
  }

  const content = getContent()

  if (loading && activeTab === 'home') {
    return (

          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
    )
  }

  return (
    <div className="main-wrapper">
      <div className="main-screen">
        <h1 className="main-title">{content.title}</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="main-layout">
          <div className="main-center">
          {activeTab === 'home' ? (
            <div className="genre-sections">
          
              {filteredPlaylists.length > 0 && (
                <div className="playlists-section">
                  <h2 className="genre-title">My playlists</h2>
                  <div className="playlists-horizontal-grid">
                    {filteredPlaylists.map((playlist) => (
                      <div
                        key={playlist.id}
                        className="playlist-horizontal-card"
                        onClick={() => onPlaylistClick?.(playlist.id)}
                      >
                        <div
                          className="playlist-horizontal-image"
                          style={{ background: playlist.cover || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                        </div>
                        <div className="playlist-horizontal-info">
                          <span className="playlist-horizontal-name">{playlist.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {homeSections.map((section, index) => {
                const isScrollable = scrollableSections[index] ?? false
                return (
                <div key={section.title} className="genre-section">
                  <h2 className="genre-title">{section.title}</h2>
                  {isScrollable && (
                    <>
                      <button 
                        type="button" 
                        className="row-scroll-btn left"
                        onClick={(e) => {
                          e.stopPropagation()
                          const el = sectionRefs.current[index]
                          if (el) el.scrollBy({ left: -300, behavior: 'smooth' })
                        }}
                      >
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M14 7L9 12L14 17"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button 
                        type="button" 
                        className="row-scroll-btn right"
                        onClick={(e) => {
                          e.stopPropagation()
                          const el = sectionRefs.current[index]
                          if (el) el.scrollBy({ left: 300, behavior: 'smooth' })
                        }}
                      >
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10 7L15 12L10 17"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                  <div
                    className="tracks-row"
                    ref={(el) => {
                      if (el) {
                        sectionRefs.current[index] = el
                      }
                    }}
                  >
                    {section.tracks.map((track) => {
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
                </div>
                )
              })}
            </div>
          ) : (
            <div className="tracks-grid">
              {content.tracks?.map((track) => {
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
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainScreen
