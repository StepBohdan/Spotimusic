import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { useAppDispatch, useAppSelector } from './src/store/hooks';
import { fetchTracks } from './src/store/thunks/tracksThunk';
import { setActiveTab, setSearchQuery } from './src/store/slices/uiSlice';
import { addToFavorites, removeFromFavorites, initializeFavorites } from './src/store/slices/favoritesSlice';
import { 
  addPlaylist, 
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  renamePlaylist,
  deletePlaylist,
  updateFavoritesPlaylistFromPlaylistTracks, 
  FAVORITES_PLAYLIST_ID,
  getRandomPlaylistCover,
  initializePlaylists 
} from './src/store/slices/playlistsSlice';
import { setCurrentTrack, setCurrentTrackList } from './src/store/slices/playerSlice';
import type { Playlist } from './src/types/music';
import MainScreen from './src/components/MainScreen/MainScreen';
import Player from './src/components/Player/Player';
import Header from './src/components/Header/Header';
import CreatePlaylistModal from './src/components/CreatePlaylistModal/CreatePlaylistModal';
import PlaylistPage from './src/pages/PlaylistPage';
import ProfileScreen from './src/screens/ProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const favoriteTracks = useAppSelector((state) => state.favorites.favoriteTracks);
  const playlists = useAppSelector((state) => state.playlists.playlists);
  const allTracks = useAppSelector((state) => state.tracks.allTracks);
  const loading = useAppSelector((state) => state.tracks.loading);
  const error = useAppSelector((state) => state.tracks.error);
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const currentTrackList = useAppSelector((state) => state.player.currentTrackList);
  const user = useAppSelector((state) => state.ui.user);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchTracks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(updateFavoritesPlaylistFromPlaylistTracks({ tracks: favoriteTracks }));
  }, [favoriteTracks, dispatch]);

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now(),
      name: name,
      tracks: [],
      cover: getRandomPlaylistCover(),
    };
    dispatch(addPlaylist(newPlaylist));
  };

  const handleAddTrackToPlaylist = (trackId: string | number, playlistId: number) => {
    if (playlistId === FAVORITES_PLAYLIST_ID) {
      const track = allTracks.find((t) => t.id === trackId);
      if (track) {
        dispatch(addToFavorites({ track, dateAdded: Date.now() }));
      }
      return;
    }

    const track = allTracks.find((t) => t.id === trackId);
    if (track) {
      dispatch(addTrackToPlaylist({ trackId, playlistId, track }));
    }
  };

  const handleRemoveTrackFromPlaylist = (trackId: string | number, playlistId: number) => {
    if (playlistId === FAVORITES_PLAYLIST_ID) {
      dispatch(removeFromFavorites(trackId));
      return;
    }

    dispatch(removeTrackFromPlaylist({ trackId, playlistId }));
  };

  const handleRenamePlaylist = (playlistId: number, newName: string) => {
    if (playlistId !== FAVORITES_PLAYLIST_ID) {
      dispatch(renamePlaylist({ playlistId, newName }));
    }
  };

  const handleDeletePlaylist = (playlistId: number) => {
    if (playlistId !== FAVORITES_PLAYLIST_ID) {
      dispatch(deletePlaylist(playlistId));
    }
  };

  const handleCreatePlaylist = () => {
    // Simple implementation - in production you'd want a proper modal
    const defaultName = `Playlist ${playlists.length}`;
    createPlaylist(defaultName);
    
    // For a better UX, you could use react-native-modal or react-native-prompt-android
    // Alert.prompt is iOS only, so for cross-platform you'd need a library
  };

  const selectedPlaylist = selectedPlaylistId
    ? playlists.find((p) => p.id === selectedPlaylistId)
    : null;

  if (selectedPlaylist) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" />
          <PlaylistPage
            user={user}
            playlist={selectedPlaylist}
            allTracks={allTracks}
            playlists={playlists}
            onTrackSelect={(track) => {
              if (currentTrack?.id === track.id) {
                return;
              }
              dispatch(setCurrentTrack(track));
              const playlistTracks = selectedPlaylist.tracks.map((item) =>
                typeof item === 'object' && 'track' in item ? item.track : item
              );
              dispatch(setCurrentTrackList(playlistTracks));
            }}
            onAddToPlaylist={handleAddTrackToPlaylist}
            onRemoveFromPlaylist={handleRemoveTrackFromPlaylist}
            onRenamePlaylist={handleRenamePlaylist}
            onDeletePlaylist={(playlistId) => {
              handleDeletePlaylist(playlistId);
              if (selectedPlaylistId === playlistId) {
                setSelectedPlaylistId(null);
              }
            }}
            onBack={() => setSelectedPlaylistId(null)}
          />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
      <Header
        searchQuery={searchQuery}
        onSearchChange={(query) => dispatch(setSearchQuery(query))}
        onGoHome={() => {
          dispatch(setActiveTab('home'));
          setSelectedPlaylistId(null);
        }}
      />
      <View style={styles.mainContent}>
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
                return;
              }
              dispatch(setCurrentTrack(track));
              if (activeTab === 'favorites') {
                const favoriteTrackIds = favoriteTracks.map(item => item.track.id);
                dispatch(setCurrentTrackList(allTracks.filter(t => favoriteTrackIds.includes(t.id))));
              } else if (activeTab === 'home') {
                dispatch(setCurrentTrackList(allTracks));
              } else {
                dispatch(setCurrentTrackList(allTracks));
              }
            }}
            searchQuery={searchQuery}
            onPlaylistClick={(playlistId) => {
              setSelectedPlaylistId(playlistId);
            }}
          />
        </View>
    </SafeAreaView>
  );
}

function CreateScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
        <View style={styles.createContainer}>
          <Text style={styles.createTitle}>Create New Playlist</Text>
          <Text style={styles.createSubtitle}>Tap the + button below to create a playlist</Text>
        </View>
    </SafeAreaView>
  );
}

function AppNavigator() {
  const dispatch = useAppDispatch();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const currentTrackList = useAppSelector((state) => state.player.currentTrackList);
  const allTracks = useAppSelector((state) => state.tracks.allTracks);

  useEffect(() => {
    // Initialize favorites and playlists from AsyncStorage
    const initializeData = async () => {
      try {
        const favoritesRaw = await AsyncStorage.getItem('spotimusic_favorite_tracks');
        if (favoritesRaw) {
          const favorites = JSON.parse(favoritesRaw);
          dispatch(initializeFavorites(favorites));
        }

        const playlistsRaw = await AsyncStorage.getItem('spotimusic_playlists');
        if (playlistsRaw) {
          const playlists = JSON.parse(playlistsRaw);
          dispatch(initializePlaylists(playlists));
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
  }, [dispatch]);

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now(),
      name: name,
      tracks: [],
      cover: getRandomPlaylistCover(),
    };
    dispatch(addPlaylist(newPlaylist));
  };

  return (
    <BottomSheetModalProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#181818',
              borderTopColor: '#282828',
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
            },
            tabBarActiveTintColor: '#1db954',
            tabBarInactiveTintColor: '#b3b3b3',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}
          tabBar={(props) => (
            <View>
              <Player
                currentTrack={currentTrack}
                allTracks={currentTrackList.length > 0 ? currentTrackList : allTracks}
                onTrackEnd={() => dispatch(setCurrentTrack(null))}
                onTrackChange={(track) => dispatch(setCurrentTrack(track))}
              />
              <BottomTabBar {...props} />
            </View>
          )}
        >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 17.0002V11.4522C20 10.9179 19.9995 10.6506 19.9346 10.4019C19.877 10.1816 19.7825 9.97307 19.6546 9.78464C19.5102 9.57201 19.3096 9.39569 18.9074 9.04383L14.1074 4.84383C13.3608 4.19054 12.9875 3.86406 12.5674 3.73982C12.1972 3.63035 11.8026 3.63035 11.4324 3.73982C11.0126 3.86397 10.6398 4.19014 9.89436 4.84244L5.09277 9.04383C4.69064 9.39569 4.49004 9.57201 4.3457 9.78464C4.21779 9.97307 4.12255 10.1816 4.06497 10.4019C4 10.6506 4 10.9179 4 11.4522V17.0002C4 17.932 4 18.3978 4.15224 18.7654C4.35523 19.2554 4.74432 19.6452 5.23438 19.8482C5.60192 20.0005 6.06786 20.0005 6.99974 20.0005C7.93163 20.0005 8.39808 20.0005 8.76562 19.8482C9.25568 19.6452 9.64467 19.2555 9.84766 18.7654C9.9999 18.3979 10 17.932 10 17.0001V16.0001C10 14.8955 10.8954 14.0001 12 14.0001C13.1046 14.0001 14 14.8955 14 16.0001V17.0001C14 17.932 14 18.3979 14.1522 18.7654C14.3552 19.2555 14.7443 19.6452 15.2344 19.8482C15.6019 20.0005 16.0679 20.0005 16.9997 20.0005C17.9316 20.0005 18.3981 20.0005 18.7656 19.8482C19.2557 19.6452 19.6447 19.2554 19.8477 18.7654C19.9999 18.3978 20 17.932 20 17.0002Z"
                      stroke={color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ),
              }}
              listeners={{
                tabPress: () => {
                  store.dispatch(setActiveTab('home'));
                },
              }}
            />
            <Tab.Screen
              name="Create"
              component={CreateScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 4v16m8-8H4"
                      stroke={color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </Svg>
                ),
              }}
              listeners={{
                tabPress: (e) => {
                  e.preventDefault();
                  setCreateModalVisible(true);
                },
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                      stroke={color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Path
                      d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22"
                      stroke={color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      <CreatePlaylistModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreate={createPlaylist}
      />
    </BottomSheetModalProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.container}>
          <AppNavigator />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#121212',
  },
  createContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  createTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  createSubtitle: {
    color: '#b3b3b3',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;
