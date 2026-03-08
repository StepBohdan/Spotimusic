import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSearchQuery } from '../store/slices/uiSlice';
import { setCurrentTrack, setCurrentTrackList } from '../store/slices/playerSlice';
import { addToFavorites, removeFromFavorites } from '../store/slices/favoritesSlice';
import {
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  FAVORITES_PLAYLIST_ID,
} from '../store/slices/playlistsSlice';
import Header from '../components/Header/Header';
import TrackCard from '../components/TrackCard/TrackCard';
import PlaylistPage from '../pages/PlaylistPage';
import type { Track } from '../types/music';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const user = useAppSelector((state) => state.ui.user);
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const favoriteTracks = useAppSelector((state) => state.favorites.favoriteTracks);
  const playlists = useAppSelector((state) => state.playlists.playlists);
  const allTracks = useAppSelector((state) => state.tracks.allTracks);
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);

  const favoriteTracksList = favoriteTracks.map(item => item.track);
  const filteredFavoriteTracks = favoriteTracksList.filter(track => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return track.name.toLowerCase().includes(query) || track.artist.toLowerCase().includes(query);
  });

  const handleTrackSelect = (track: Track) => {
    dispatch(setCurrentTrack(track));
    dispatch(setCurrentTrackList(filteredFavoriteTracks));
  };

  const handlePlaylistClick = (playlistId: number) => {
    setSelectedPlaylistId(playlistId);
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

  if (selectedPlaylistId !== null) {
    const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" />
        <PlaylistPage
          user={user}
          playlist={selectedPlaylist}
          allTracks={allTracks}
          playlists={playlists}
          onTrackSelect={(track) => {
            if (currentTrack?.id === track.id) return;
            dispatch(setCurrentTrack(track));
            if (selectedPlaylist) {
              const playlistTracks = selectedPlaylist.tracks.map((item) =>
                typeof item === 'object' && 'track' in item ? item.track : item
              );
              dispatch(setCurrentTrackList(playlistTracks));
            }
          }}
          onAddToPlaylist={handleAddTrackToPlaylist}
          onRemoveFromPlaylist={handleRemoveTrackFromPlaylist}
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
        onSearchChange={(value) => dispatch(setSearchQuery(value))}
        onGoHome={() => navigation.navigate('Home')}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              style={styles.avatarGradient}
            >
              <Text style={styles.profileAvatarText}>
                {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </Text>
            </LinearGradient>
          </View>
          <Text style={styles.profileName}>
            {user?.username || user?.email || 'Guest'}
          </Text>
        </View>

        {filteredFavoriteTracks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorite tracks</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {filteredFavoriteTracks.map((track) => {
                const isSelected = currentTrack?.id === track.id;
                return (
                  <TrackCard
                    key={track.id}
                    track={track}
                    selected={isSelected}
                    isPlaying={isSelected && isPlaying}
                    onSelect={() => handleTrackSelect(track)}
                  />
                );
              })}
            </ScrollView>
          </View>
        )}

        {playlists.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My playlists</Text>
            <View style={styles.playlistsGrid}>
              {playlists.map((playlist, index) => {
                const isLeft = index % 2 === 0;
                const tracksCount = playlist.tracks.length;

                return (
                  <TouchableOpacity
                    key={playlist.id}
                    style={[
                      styles.playlistCard,
                      isLeft ? styles.playlistCardLeft : styles.playlistCardRight,
                    ]}
                    onPress={() => handlePlaylistClick(playlist.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.playlistImageContainer}>
                      {playlist.cover && !playlist.cover.match(/#[0-9a-fA-F]{6}/) ? (
                        <Image
                          source={{ uri: playlist.cover }}
                          style={styles.playlistImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <LinearGradient
                          colors={[
                            ['#8B5CF6', '#6366F1'],
                            ['#EC4899', '#F43F5E'],
                            ['#10B981', '#059669'],
                            ['#3B82F6', '#2563EB'],
                            ['#F59E0B', '#D97706'],
                            ['#EF4444', '#DC2626'],
                          ][playlist.id % 6] as [string, string]}
                          style={styles.playlistImage}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        />
                      )}
                    </View>
                    <View style={styles.playlistNameContainer}>
                      <Text style={styles.playlistName} numberOfLines={2}>
                        {playlist.name}
                      </Text>
                      <Text style={styles.playlistTracksCount}>
                        {tracksCount} {tracksCount === 1 ? 'track' : 'tracks'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  profileName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingRight: 16,
  },
  playlistsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playlistCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#181818',
  },
  playlistCardLeft: {
    marginRight: '4%',
  },
  playlistCardRight: {
    marginLeft: 0,
  },
  playlistImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#3b3b3b',
    overflow: 'hidden',
  },
  playlistImage: {
    width: '100%',
    height: '100%',
  },
  playlistNameContainer: {
    backgroundColor: '#181818',
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 60,
    justifyContent: 'center',
  },
  playlistName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },
  playlistTracksCount: {
    color: '#b3b3b3',
    fontSize: 12,
  },
});
