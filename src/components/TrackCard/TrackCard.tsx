import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';
import { requestPlay, requestPause } from '../../store/slices/playerSlice';
import IconButton from '../IconButton/IconButton';
import type { Track } from '../../types/music';

interface TrackCardProps {
  track: Track;
  onSelect: () => void;
  selected: boolean;
  isPlaying?: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({
  track,
  onSelect,
  selected,
  isPlaying = false,
}) => {
  const dispatch = useAppDispatch();
  const favoriteTracks = useAppSelector((state) => state.favorites.favoriteTracks);
  const isFavorite = favoriteTracks.some(item => item.track.id === track.id);

  const handleFavoritePress = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(track.id));
    } else {
      dispatch(addToFavorites({ track, dateAdded: Date.now() }));
    }
  };

  const handleCardPress = () => {
    if (selected && isPlaying) {
      dispatch(requestPause());
    } else if (selected && !isPlaying) {
      dispatch(requestPlay());
    } else {
      onSelect();
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IconButton
            variant="favorite"
            active={isFavorite}
            size={20}
          />
        </TouchableOpacity>
        {track.image ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: track.image }} style={styles.image} />
            
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <View style={styles.playOverlay}>
              <View style={styles.playButton}>
                <IconButton
                  variant={selected && isPlaying ? 'pause' : 'play'}
                  size={32}
                />
              </View>
            </View>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{track.name}</Text>
        <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 12,
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#333',
    marginBottom: 8,
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(29, 185, 84, 0.9)',
    borderRadius: 25,
    padding: 8,
  },
  info: {
    paddingHorizontal: 4,
  },
  name: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 12,
  },
});

export default TrackCard;
