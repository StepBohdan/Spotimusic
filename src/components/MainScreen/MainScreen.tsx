import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector } from '../../store/hooks';
import TrackCard from '../TrackCard/TrackCard';
import type { Track, Playlist, PlaylistTrack } from '../../types/music';

interface MainScreenProps {
  activeTab: 'home' | 'playlists' | 'favorites';
  playlists: Playlist[];
  onCreatePlaylist: (name: string) => void;
  favoriteTracks: PlaylistTrack[];
  allTracks: Track[];
  error?: string | null;
  loading?: boolean;
  onTrackSelect: (track: Track) => void;
  searchQuery: string;
  onPlaylistClick?: (playlistId: number) => void;
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
  const shuffledTracksFromStore = useAppSelector((state) => state.tracks.shuffledTracks);
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);
  
  const randomTracks = useMemo(() => {
    if (shuffledTracksFromStore.length > 0) {
      return shuffledTracksFromStore;
    }
    return allTracks;
  }, [shuffledTracksFromStore, allTracks]);

  const filteredFavoriteTracks = useMemo(() => {
    const favoriteTrackIds = favoriteTracks.map(item => item.track.id);
    const base = allTracks.filter(t => favoriteTrackIds.includes(t.id));
    if (!searchQuery.trim()) return base;

    const query = searchQuery.toLowerCase();
    return base.filter(track =>
      track.name.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query)
    );
  }, [allTracks, favoriteTracks, searchQuery]);

  const homeSections = useMemo(() => {
    const sectionTracks = [
      randomTracks.slice(0, 10),
      randomTracks.slice(10, 20),
      randomTracks.slice(20, 30),
      randomTracks.slice(30, 40),
      randomTracks.slice(40, 50),
      randomTracks.slice(50, 60),
    ];

    const query = searchQuery.trim() ? searchQuery.toLowerCase() : null;
    
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
      {
        title: 'Rock',
        tracks: query
          ? sectionTracks[4].filter(track =>
              track.name.toLowerCase().includes(query) ||
              track.artist.toLowerCase().includes(query)
            )
          : sectionTracks[4],
      },
      {
        title: 'Country',
        tracks: query
          ? sectionTracks[5].filter(track =>
              track.name.toLowerCase().includes(query) ||
              track.artist.toLowerCase().includes(query)
            )
          : sectionTracks[5],
      },
    ];

    return sections.filter(section => section.tracks.length > 0);
  }, [randomTracks, searchQuery]);
  
  const getContent = () => {
    switch (activeTab) {
      case 'home':
        return {
          title: '',
        };
      case 'favorites':
        return {
          title: 'Favorite',
          tracks: filteredFavoriteTracks,
        };
      default:
        return {
          title: 'My playlists',
        };
    }
  };

  const content = getContent();

  if (loading && activeTab === 'home') {
    return (
      <LinearGradient colors={['#1b1630', '#121212']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1db954" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1b1630', '#121212']} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={[styles.errorContainer, { marginTop: 24 }]}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {activeTab === 'home' ? (
          <>
            {playlists.length > 0 && (
              <View style={[styles.section, { marginTop: 24 }]}>
                <View style={styles.playlistsGrid}>
                  {playlists.map((playlist, index) => {
                    let backgroundColor = '#3b3b3b';
                    if (playlist.cover) {
                      const match = playlist.cover.match(/#[0-9a-fA-F]{6}/);
                      if (match) {
                        backgroundColor = match[0];
                      }
                    }

                    const isLeft = index % 2 === 0;

                    return (
                      <TouchableOpacity
                        key={playlist.id}
                        style={[
                          styles.playlistCard,
                          isLeft ? styles.playlistCardLeft : {},
                        ]}
                        onPress={() => onPlaylistClick?.(playlist.id)}
                        activeOpacity={0.8}
                      >
                        <View style={[styles.playlistImageContainer, { backgroundColor }]}>
                          {playlist.cover && !playlist.cover.match(/#[0-9a-fA-F]{6}/) ? (
                            <Image 
                              source={{ uri: playlist.cover }} 
                              style={styles.playlistImage}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={[styles.playlistImagePlaceholder, { backgroundColor }]} />
                          )}
                        </View>
                        <View style={styles.playlistNameContainer}>
                          <Text style={styles.playlistName} numberOfLines={1}>
                            {playlist.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          {homeSections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {section.tracks.map((track) => {
                  const isSelected = currentTrack?.id === track.id;
                  return (
                    <TrackCard
                      key={track.id}
                      track={track}
                      selected={isSelected}
                      isPlaying={isSelected && isPlaying}
                      onSelect={() => onTrackSelect(track)}
                    />
                  );
                })}
              </ScrollView>
            </View>
          ))}
        </>
      ) : (
        <View style={styles.grid}>
          {content.tracks?.map((track) => {
            const isSelected = currentTrack?.id === track.id;
            return (
              <TrackCard
                key={track.id}
                track={track}
                selected={isSelected}
                isPlaying={isSelected && isPlaying}
                onSelect={() => onTrackSelect(track)}
              />
            );
          })}
        </View>
      )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 24,
    marginBottom: 20,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#e22134',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  horizontalScroll: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  playlistsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181818',
    width: '48%',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  playlistCardLeft: {
    marginRight: '4%',
  },
  playlistImageContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#3b3b3b',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  playlistImage: {
    width: '100%',
    height: '100%',
  },
  playlistImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3b3b3b',
  },
  playlistNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  playlistName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default MainScreen;
