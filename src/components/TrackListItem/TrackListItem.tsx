import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { useAppDispatch } from '../../store/hooks';
import { requestPlay, requestPause } from '../../store/slices/playerSlice';
import type { Playlist, Track } from '../../types/music';
import IconButton from '../IconButton/IconButton';

interface TrackListItemProps {
  track: Track;
  index: number;
  playlistId?: number;
  dateAdded?: number;
  onSelect: () => void;
  onRemoveFromPlaylist?: (trackId: string | number, playlistId: number) => void;
  onAddToPlaylist?: (trackId: string | number, playlistId: number) => void;
  playlists?: Playlist[];
  isPlaying?: boolean;
  selected: boolean;
}

const TrackListItem: React.FC<TrackListItemProps> = ({
  track,
  index,
  playlistId,
  dateAdded,
  onSelect,
  onRemoveFromPlaylist,
  onAddToPlaylist,
  playlists = [],
  isPlaying = false,
  selected,
}) => {
  const dispatch = useAppDispatch();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const handlePlayPress = () => {
    if (selected && isPlaying) {
      dispatch(requestPause());
    } else if (selected && !isPlaying) {
      dispatch(requestPlay());
    } else {
      onSelect();
    }
  };

  const handleItemPress = () => {
    if (selected && isPlaying) {
      dispatch(requestPause());
    } else if (selected && !isPlaying) {
      dispatch(requestPlay());
    } else {
      onSelect();
    }
  };

  const handleRemoveFromPlaylist = () => {
    if (playlistId && onRemoveFromPlaylist) {
      onRemoveFromPlaylist(track.id, playlistId);
    }
    setShowOptionsMenu(false);
  };

  const handlePlaylistSelect = (selectedPlaylistId: number) => {
    if (onAddToPlaylist) {
      onAddToPlaylist(track.id, selectedPlaylistId);
    }
    setShowOptionsMenu(false);
  };

  const formatDateAdded = (timestamp?: number): string => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    } else {
      return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handleItemPress} activeOpacity={0.7}>
        <Text style={styles.number}>{index + 1}</Text>
        <View style={styles.imageContainer}>
          {track.image ? (
            <Image source={{ uri: track.image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <IconButton variant="play" size={16} />
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, selected && styles.nameSelected]} numberOfLines={1}>
            {track.name}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {track.artist}
          </Text>
        </View>
        <Text style={styles.date} numberOfLines={1}>
          {dateAdded ? formatDateAdded(dateAdded) : ''}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handlePlayPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <IconButton
              variant={selected && isPlaying ? 'pause' : 'play'}
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowOptionsMenu(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.optionsButton}>
              <View style={styles.optionsDot} />
              <View style={styles.optionsDot} />
              <View style={styles.optionsDot} />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showOptionsMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptionsMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowOptionsMenu(false)}
        >
          <View style={styles.optionsMenu}>
            {playlists.length > 0 && onAddToPlaylist && (
              <View style={styles.submenu}>
                <Text style={styles.submenuLabel}>Add to playlist:</Text>
                {playlists.map((playlist, index) => {
                  const playlistTracks = playlist.tracks.map((item) =>
                    typeof item === 'object' && 'track' in item ? item.track : item
                  );
                  const isInPlaylist = playlistTracks.some((t: Track) => t.id === track.id);
                  const isLast = index === playlists.length - 1;

                  return (
                    <TouchableOpacity
                      key={playlist.id}
                      style={[
                        styles.menuItem,
                        isInPlaylist && styles.menuItemDisabled,
                        !isLast && styles.menuItemBorder,
                      ]}
                      onPress={() => {
                        if (!isInPlaylist) {
                          handlePlaylistSelect(playlist.id);
                        }
                      }}
                      disabled={isInPlaylist}
                    >
                      <Text style={[styles.menuItemText, isInPlaylist && styles.menuItemTextDisabled]}>
                        {playlist.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            {playlistId && onRemoveFromPlaylist && (
              <>
                {playlists.length > 0 && onAddToPlaylist && <View style={styles.divider} />}
                <TouchableOpacity
                  style={[styles.menuItem, styles.menuItemDelete]}
                  onPress={handleRemoveFromPlaylist}
                >
                  <Text style={[styles.menuItemText, styles.menuItemTextDelete]}>
                    Remove from playlist
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  number: {
    color: '#b3b3b3',
    fontSize: 14,
    width: 30,
    textAlign: 'right',
    marginRight: 12,
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#282828',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282828',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  nameSelected: {
    color: '#1db954',
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  date: {
    color: '#b3b3b3',
    fontSize: 12,
    width: 80,
    marginRight: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionsButton: {
    flexDirection: 'column',
    gap: 3,
  },
  optionsDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#b3b3b3',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsMenu: {
    backgroundColor: '#282828',
    borderRadius: 8,
    minWidth: 200,
    paddingVertical: 8,
  },
  submenu: {
    paddingHorizontal: 8,
  },
  submenuLabel: {
    color: '#b3b3b3',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#363636',
  },
  menuItemDelete: {},
  menuItemText: {
    color: '#ffffff',
    fontSize: 14,
  },
  menuItemTextDisabled: {
    color: '#b3b3b3',
  },
  menuItemTextDelete: {
    color: '#e22134',
  },
  divider: {
    height: 1,
    backgroundColor: '#404040',
    marginVertical: 4,
  },
});

export default TrackListItem;
