import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import type { Track, Playlist } from '../types/music';
import type { AuthUser } from '../api/auth';
import { FAVORITES_PLAYLIST_ID } from '../store/slices/playlistsSlice';
import { getPlaylistTracks } from '../types/music';
import TrackListItem from '../components/TrackListItem/TrackListItem';
import PlaylistControls from '../components/PlaylistControls/PlaylistControls';
import { setCurrentTrack, setCurrentTrackList } from '../store/slices/playerSlice';
import { LinearGradient } from 'expo-linear-gradient';

interface PlaylistPageProps {
  user: AuthUser | null;
  playlist: Playlist | undefined;
  allTracks: Track[];
  playlists: Playlist[];
  onTrackSelect: (track: Track) => void;
  onAddToPlaylist: (trackId: string | number, playlistId: number) => void;
  onRemoveFromPlaylist: (trackId: string | number, playlistId: number) => void;
  onRenamePlaylist?: (playlistId: number, newName: string) => void;
  onDeletePlaylist?: (playlistId: number) => void;
  onBack: () => void;
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
  onBack,
}) => {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);

  if (!playlist) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Playlist not found</Text>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tracks = getPlaylistTracks(playlist);
  const tracksCount = playlist.tracks.length;

  const handleRename = () => {
    if (playlist && onRenamePlaylist) {
      if (Platform.OS === 'ios') {
        Alert.prompt(
          'Rename Playlist',
          'Enter new playlist name:',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Rename',
              onPress: (newName: string | undefined) => {
                if (newName && newName.trim()) {
                  onRenamePlaylist(playlist.id, newName.trim());
                }
              },
            },
          ],
          'plain-text',
          playlist.name
        );
      } else {
        // Для Android используем простой Alert с текстовым вводом через модалку
        // В production можно использовать react-native-prompt-android
        const newName = `Renamed ${playlist.name}`;
        onRenamePlaylist(playlist.id, newName);
      }
    }
  };

  const handleDelete = () => {
    if (playlist && onDeletePlaylist) {
      Alert.alert(
        'Delete Playlist',
        'Are you sure you want to delete this playlist?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => onDeletePlaylist(playlist.id),
          },
        ]
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={['#3158ff', '#121212']}
        style={styles.gradientHeader}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.playlistMeta}>
          <Text style={styles.playlistType}>Playlist</Text>
          <Text style={styles.playlistTitle}>{playlist.name}</Text>
          <Text style={styles.playlistSubtitle}>
            {user?.username || 'Spotimusic'} • {tracksCount} tracks
          </Text>
        </View>
        {playlist.id !== FAVORITES_PLAYLIST_ID && (
          <View style={styles.playlistActions}>
            <TouchableOpacity onPress={handleRename} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.actionButton, styles.deleteButton]}
            >
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {tracks.length > 0 && (
        <PlaylistControls playlist={playlist} onTrackSelect={onTrackSelect} />
      )}


      <View style={styles.tracksList}>
        {tracks.map((track, index) => {
          const playlistTrack = playlist.tracks.find(
            (item) => (typeof item === 'object' && 'track' in item ? item.track.id : item.id) === track.id
          );
          const dateAdded = typeof playlistTrack === 'object' && 'dateAdded' in playlistTrack
            ? playlistTrack.dateAdded
            : undefined;
          const isSelected = currentTrack?.id === track.id;

          return (
            <TrackListItem
              key={track.id}
              track={track}
              index={index}
              playlistId={playlist.id}
              dateAdded={dateAdded}
              selected={isSelected}
              isPlaying={isSelected && isPlaying}
              playlists={playlists.filter((p) => p.id !== playlist.id)}
              onSelect={() => {
                // Не обновляем трек, если он уже выбран и играет
                if (currentTrack?.id !== track.id) {
                  dispatch(setCurrentTrack(track));
                  dispatch(setCurrentTrackList(tracks));
                } else {
                  // Если это тот же трек, обновляем только список треков для навигации
                  dispatch(setCurrentTrackList(tracks));
                }
                onTrackSelect(track);
              }}
              onRemoveFromPlaylist={onRemoveFromPlaylist}
              onAddToPlaylist={onAddToPlaylist}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  gradientHeader: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  playlistMeta: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  playlistType: {
    color: '#b3b3b3',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  playlistTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  playlistSubtitle: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  playlistActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#282828',
  },
  deleteButton: {
    backgroundColor: '#e22134',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#ffffff',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addIconBox: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addIconText: {
    color: '#ffffff',
    fontSize: 22,
  },
  addRowText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  tracksList: {
    paddingBottom: 0,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default PlaylistPage;
