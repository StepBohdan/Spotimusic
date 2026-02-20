import { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import MainScreen from './components/MainScreen/MainScreen'
import Player from './components/Player/Player'
import Header from './components/Header/Header'
import Profile from './pages/Profile'
import PlaylistPage from './pages/PlaylistPage'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { fetchTracks } from './store/thunks/tracksThunk'
import { setActiveTab, setSearchQuery, setUser } from './store/slices/uiSlice'
import { addToFavorites, removeFromFavorites } from './store/slices/favoritesSlice'
import { addPlaylist, addTrackToPlaylist, removeTrackFromPlaylist, renamePlaylist, deletePlaylist, updateFavoritesPlaylistFromPlaylistTracks, FAVORITES_PLAYLIST_ID, getRandomPlaylistCover } from './store/slices/playlistsSlice'
import { setCurrentTrack, setCurrentTrackList } from './store/slices/playerSlice'
import { getPlaylistTracks, type Playlist } from './types/music'
import './App.css'

function App() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // Redux state
  const activeTab = useAppSelector((state) => state.ui.activeTab)
  const searchQuery = useAppSelector((state) => state.ui.searchQuery)
  const user = useAppSelector((state) => state.ui.user)
  const favoriteTracks = useAppSelector((state) => state.favorites.favoriteTracks)
  const playlists = useAppSelector((state) => state.playlists.playlists)
  const allTracks = useAppSelector((state) => state.tracks.allTracks)
  const loading = useAppSelector((state) => state.tracks.loading)
  const error = useAppSelector((state) => state.tracks.error)
  const currentTrack = useAppSelector((state) => state.player.currentTrack)
  const currentTrackList = useAppSelector((state) => state.player.currentTrackList)


  useEffect(() => {
    dispatch(fetchTracks())
  }, [dispatch])

  useEffect(() => {
    dispatch(updateFavoritesPlaylistFromPlaylistTracks({ tracks: favoriteTracks }))
  }, [favoriteTracks, dispatch])


  useEffect(() => {
    if (location.pathname.startsWith('/favorite')) {
      dispatch(setActiveTab('favorites'))
    } else if (location.pathname.startsWith('/playlist')) {
      dispatch(setActiveTab('playlists'))
    } else {
      dispatch(setActiveTab('home'))
    }
  }, [location.pathname, dispatch])

  const handleTabChange = (tab: 'home' | 'playlists' | 'favorites', playlistId?: number) => {
    dispatch(setActiveTab(tab))
    if (tab === 'playlists' && playlistId) {
      navigate(`/playlist/${playlistId}`)
    } else {
      navigate('/')
    }
  }

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now(),
      name: name,
      tracks: [],
      cover: getRandomPlaylistCover(),
    }
    dispatch(addPlaylist(newPlaylist))
  }


  const handleAddTrackToPlaylist = (trackId: string | number, playlistId: number) => {
    if (playlistId === FAVORITES_PLAYLIST_ID) {
      const track = allTracks.find((t) => t.id === trackId)
      if (track) {
        dispatch(addToFavorites({ track, dateAdded: Date.now() }))
      }
      return
    }

    const track = allTracks.find((t) => t.id === trackId)
    if (track) {
      dispatch(addTrackToPlaylist({ trackId, playlistId, track }))
    }
  }

  const handleRemoveTrackFromPlaylist = (trackId: string | number, playlistId: number) => {
    if (playlistId === FAVORITES_PLAYLIST_ID) {
      dispatch(removeFromFavorites(trackId))
      return
    }

    dispatch(removeTrackFromPlaylist({ trackId, playlistId }))
  }

  const handleRenamePlaylist = (playlistId: number, newName: string) => {
    if (playlistId !== FAVORITES_PLAYLIST_ID) {
      dispatch(renamePlaylist({ playlistId, newName }))
        }
      }

  const handleDeletePlaylist = (playlistId: number) => {
    if (playlistId !== FAVORITES_PLAYLIST_ID) {
      dispatch(deletePlaylist(playlistId))
      if (location.pathname === `/playlist/${playlistId}`) {
        navigate('/')
      }
    }
  }

  const handleCreatePlaylist = () => {
    const name = window.prompt('Playlist name')
    if (name && name.trim()) {
      createPlaylist(name.trim())
    }
  }

  const PlaylistRoute = () => {
    const { id } = useParams<{ id: string }>()
    const playlistId = Number(id)
    const playlist = playlists.find((p) => p.id === playlistId)

    return (
      <div className="app-content">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          playlists={playlists}
          onCreatePlaylist={handleCreatePlaylist}
        />
        <PlaylistPage
          user={user}
          playlist={playlist}
          playlists={playlists}
          allTracks={allTracks}
          onTrackSelect={(track) => {
            if (currentTrack?.id === track.id) {
              return
            }
            dispatch(setCurrentTrack(track))
            dispatch(setCurrentTrackList(playlist ? getPlaylistTracks(playlist) : allTracks))
          }}
          onAddToPlaylist={handleAddTrackToPlaylist}
          onRemoveFromPlaylist={handleRemoveTrackFromPlaylist}
          onRenamePlaylist={handleRenamePlaylist}
          onDeletePlaylist={handleDeletePlaylist}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <div className="app-header">
        <Header
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSearchChange={(query) => dispatch(setSearchQuery(query))}
          onGoHome={() => handleTabChange('home')}
          onUserChange={(user) => dispatch(setUser(user))}
        />
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-content">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          playlists={playlists}
          onCreatePlaylist={handleCreatePlaylist}
        />
        <MainScreen 
          activeTab={activeTab} 
          playlists={playlists}
          onCreatePlaylist={createPlaylist}
          favoriteTracks={favoriteTracks}
          allTracks={allTracks}
          error={error}
          loading={loading}
          onTrackSelect={(track) => {
            if (currentTrack?.id === track.id) {
              return
            }
            dispatch(setCurrentTrack(track))
            if (activeTab === 'favorites') {
              const favoriteTrackIds = favoriteTracks.map(item => item.track.id)
              dispatch(setCurrentTrackList(allTracks.filter(t => favoriteTrackIds.includes(t.id))))
            } else if (activeTab === 'home') {
              dispatch(setCurrentTrackList(allTracks))
            } else {
              dispatch(setCurrentTrackList(allTracks))
            }
          }}
          searchQuery={searchQuery}
          onPlaylistClick={(playlistId) => handleTabChange('playlists', playlistId)}
        />
            </div>
          }
        />
        <Route
          path="/profile"
          element={
            <div className="app-content">
              <Sidebar 
                activeTab={activeTab} 
                onTabChange={handleTabChange}
                playlists={playlists}
                onCreatePlaylist={handleCreatePlaylist}
              />
              <div className="main-wrapper">
                <Profile
                  user={user}
                  favoriteTracks={favoriteTracks}
                  playlists={playlists}
                  onTabChange={handleTabChange}
                  allTracks={allTracks}
                  onTrackSelect={(track) => {
                    if (currentTrack?.id === track.id) {
                      return
                    }
                    dispatch(setCurrentTrack(track))
                    const favoriteTrackIds = favoriteTracks.map(item => item.track.id)
                    dispatch(setCurrentTrackList(allTracks.filter(t => favoriteTrackIds.includes(t.id))))
                  }}
                  onAddToPlaylist={handleAddTrackToPlaylist}
                  onRemoveFromPlaylist={handleRemoveTrackFromPlaylist}
                  onRenamePlaylist={handleRenamePlaylist}
                  onDeletePlaylist={handleDeletePlaylist}
                />
              </div>
            </div>
          }
        />
        <Route path="/playlist/:id" element={<PlaylistRoute />} />
      </Routes>
      <Player 
        currentTrack={currentTrack}
        allTracks={currentTrackList.length > 0 ? currentTrackList : allTracks}
        onTrackEnd={() => dispatch(setCurrentTrack(null))}
        onTrackChange={(track) => dispatch(setCurrentTrack(track))}
      />
    </div>
  )
}

export default App
