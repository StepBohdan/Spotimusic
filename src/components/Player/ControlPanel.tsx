import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import IconButton from '../IconButton/IconButton';
import type { Track } from '../../types/music';

interface ControlPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onOpenFullPlayer?: () => void;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  currentTrack: Track | null;
  isLoading?: boolean;
  hasTrack?: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onPlay,
  onPause,
  onOpenFullPlayer,
  currentTime,
  duration,
  isPlaying,
  currentTrack,
  isLoading = false,
  hasTrack = false,
}) => {


  const showProgress = useMemo(() => {
    return Boolean(hasTrack && !isLoading && duration > 0);
  }, [duration, hasTrack, isLoading]);

  const progressPercent = useMemo(() => {
    if (!showProgress) return 0;
    const raw = currentTime / duration;
    if (!Number.isFinite(raw)) return 0;
    const clamped = Math.min(1, Math.max(0, raw));
    return Math.round(clamped * 1000) / 10; // 0.1% precision
  }, [currentTime, duration, showProgress]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          style={styles.trackInfo}
          onPress={() => {
            onOpenFullPlayer?.();
          }}
        >
          {currentTrack?.image ? (
            <Image source={{ uri: currentTrack.image }} style={styles.trackImage} />
          ) : (
            <View style={styles.trackImagePlaceholder}>
              <IconButton variant="play" size={24} />
            </View>
          )}
          <View style={styles.trackDetails}>
            <Text style={styles.trackName} numberOfLines={1}>
              {currentTrack?.name || 'Select track'}
            </Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {currentTrack?.artist || ''}
            </Text>
          </View>
        </Pressable>

        <IconButton
          variant={isPlaying ? 'pause' : 'play'}
          onPress={isPlaying ? onPause : onPlay}
          disabled={!hasTrack || isLoading}
          size={28}
          style={styles.playButton}
        />
      </View>

      {showProgress && (
        <View style={styles.progressLineTrack}>
          <View style={[styles.progressLineFill, { width: `${progressPercent}%` }]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginBottom: 4,
    paddingHorizontal: 12,
    backgroundColor: '#181818',
    borderColor: '#282828',
    borderTopWidth: 1,
    maxHeight: 60,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  row: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trackImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  trackImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackDetails: {
    flex: 1,
  },
  trackName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  trackArtist: {
    color: '#b3b3b3',
    fontSize: 12,
    marginTop: 2,
  },
  playButton: {
    marginLeft: 10,
  },
  progressLineTrack: {
    height: 2,
    width: '100%',
    backgroundColor: '#2a2a2a',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressLineFill: {
    height: '100%',
    backgroundColor: '#ffffff',
  },
});

export default ControlPanel;
