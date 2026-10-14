import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { cyclePlaybackMode } from '../../store/slices/playerSlice';
import type { Track } from '../../types/music';
import IconButton from '../IconButton/IconButton';

interface FullPlayerSheetProps {
  visible: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  hasTrack: boolean;
  isLoading?: boolean;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (seconds: number) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function FullPlayerSheet({
  visible,
  onClose,
  currentTrack,
  isPlaying,
  hasTrack,
  isLoading = false,
  currentTime,
  duration,
  onPlay,
  onPause,
  onSeek,
  onNextTrack,
  onPrevTrack,
}: FullPlayerSheetProps) {
  const dispatch = useAppDispatch();
  const playbackMode = useAppSelector((state) => state.player.playbackMode);
  const insets = useSafeAreaInsets();

  const handleCyclePlaybackMode = () => {
    dispatch(cyclePlaybackMode());
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 24) }]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle} numberOfLines={1}>
            Now playing
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.artworkWrap}>
          {currentTrack?.image ? (
            <Image source={{ uri: currentTrack.image }} style={styles.artwork} />
          ) : (
            <View style={[styles.artwork, styles.artworkPlaceholder]} />
          )}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaText}>
            <Text style={styles.trackName} numberOfLines={1}>
              {currentTrack?.name || 'Select track'}
            </Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {currentTrack?.artist || ''}
            </Text>
          </View>
        </View>

        <View style={styles.sliderRow}>
          <Slider
            value={currentTime}
            minimumValue={0}
            maximumValue={Math.max(duration, 0.1)}
            onSlidingComplete={onSeek}
            disabled={!hasTrack || isLoading || duration <= 0}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="#3a3a3a"
            thumbTintColor="#ffffff"
          />
          <View style={styles.timeRow}>
            <Text style={styles.time}>{formatTime(currentTime)}</Text>
            <Text style={styles.time}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            onPress={handleCyclePlaybackMode}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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

          <TouchableOpacity
            onPress={onPrevTrack}
            disabled={!hasTrack || isLoading}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconButton variant="prev" size={28} disabled={!hasTrack || isLoading} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isPlaying ? onPause : onPlay}
            disabled={!hasTrack || isLoading}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.playBig}
          >
            <View style={styles.playBigIconContainer}>
              <IconButton
                variant={isPlaying ? 'pause' : 'play'}
                size={34}
                disabled={!hasTrack || isLoading}
                iconColor="#000000"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNextTrack}
            disabled={!hasTrack || isLoading}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconButton variant="next" size={28} disabled={!hasTrack || isLoading} />
          </TouchableOpacity>

          <View style={{ width: 24 }} />
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  chevron: {
    color: '#ffffff',
    fontSize: 22,
    width: 24,
    textAlign: 'left',
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  artworkWrap: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  artwork: {
    width: '92%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
  },
  artworkPlaceholder: {
    backgroundColor: '#2a2a2a',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    flex: 1,
  },
  trackName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  trackArtist: {
    color: '#b3b3b3',
    fontSize: 14,
    marginTop: 6,
  },
  sliderRow: {
    marginTop: 6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  time: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  controlsRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 26,
  },
  playBig: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBigIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
