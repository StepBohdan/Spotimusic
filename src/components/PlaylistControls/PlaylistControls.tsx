import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { Playlist, Track } from '../../types/music';
import { requestPlay, requestPause, cyclePlaybackMode } from '../../store/slices/playerSlice';
import { getPlaylistTracks } from '../../types/music';
import IconButton from '../IconButton/IconButton';

interface PlaylistControlsProps {
  playlist: Playlist;
  onTrackSelect: (track: Track) => void;
}

const PlaylistControls: React.FC<PlaylistControlsProps> = ({ playlist, onTrackSelect }) => {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);
  const playbackMode = useAppSelector((state) => state.player.playbackMode);
  const tracks = getPlaylistTracks(playlist);
  const tracksCount = playlist.tracks.length;

  if (tracksCount === 0) {
    return null;
  }

  const isCurrentTrackInPlaylist = tracks.some(
    (track) => currentTrack && track.id === currentTrack.id
  );

  const isPlaylistPlaying = isCurrentTrackInPlaylist && isPlaying;

  const handlePlaylistPlayPress = () => {
    if (!playlist || playlist.tracks.length === 0) return;

    if (isCurrentTrackInPlaylist) {
      if (isPlaying) {
        dispatch(requestPause());
      } else {
        dispatch(requestPlay());
      }
      return;
    }

    const firstTrack = tracks[0];
    onTrackSelect(firstTrack);
  };

  const handleCyclePlaybackMode = () => {
    dispatch(cyclePlaybackMode());
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.playButton, isPlaylistPlaying && styles.playButtonActive]}
          onPress={handlePlaylistPlayPress}
        >
          <IconButton
            variant={isPlaylistPlaying ? 'pause' : 'play'}
            size={32}
            iconColor="#000000"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCyclePlaybackMode}
          style={[styles.repeatButton, playbackMode !== 'sequential' && styles.repeatButtonActive]}
        >
          <IconButton
            variant={
              playbackMode === 'shuffle'
                ? 'shuffle'
                : playbackMode === 'repeat-one'
                ? 'repeat-one'
                : 'repeat'
            }
            size={24}
            active={playbackMode !== 'sequential'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1db954',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonActive: {
    backgroundColor: '#1ed760',
  },
  repeatButton: {
    padding: 8,
  },
  repeatButtonActive: {
    opacity: 1,
  },
});

export default PlaylistControls;
