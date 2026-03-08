import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import type { Playlist } from '../../types/music';

interface SidebarProps {
  activeTab: 'home' | 'playlists' | 'favorites';
  onTabChange: (tab: 'home' | 'playlists' | 'favorites', playlistId?: number) => void;
  playlists: Playlist[];
  onCreatePlaylist: () => void;
}

function Sidebar({ activeTab, onTabChange, playlists, onCreatePlaylist }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTabStyle = (tab: 'home' | 'playlists' | 'favorites') => {
    return activeTab === tab ? styles.tabActive : styles.tab;
  };

  const getTabTextStyle = (tab: 'home' | 'playlists' | 'favorites') => {
    return activeTab === tab ? styles.tabTextActive : styles.tabText;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onTabChange('home')} style={styles.logoContainer}>
          <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <G>
              <Path
                d="M9.772 4.28c.56-.144 1.097.246 1.206.814.1.517-.263 1.004-.771 1.14A7 7 0 1 0 19 12.9c.009-.5.4-.945.895-1 .603-.067 1.112.371 1.106.977L21 13c0 .107-.002.213-.006.32a.898.898 0 0 1 0 .164l-.008.122a9 9 0 0 1-9.172 8.392A9 9 0 0 1 9.772 4.28z"
                fill="#1db954"
              />
              <Path
                d="M15.93 13.753a4.001 4.001 0 1 1-6.758-3.581A4 4 0 0 1 12 9c.75 0 1.3.16 2 .53 0 0 .15.09.25.17-.1-.35-.228-1.296-.25-1.7a58.75 58.75 0 0 1-.025-2.035V2.96c0-.52.432-.94.965-.94.103 0 .206.016.305.048l4.572 1.689c.446.145.597.23.745.353.148.122.258.27.33.446.073.176.108.342.108.801v1.16c0 .518-.443.94-.975.94a.987.987 0 0 1-.305-.049l-1.379-.447-.151-.05c-.437-.14-.618-.2-.788-.26a5.697 5.697 0 0 1-.514-.207 3.53 3.53 0 0 1-.213-.107c-.098-.05-.237-.124-.521-.263L16 6l.011 7c0 .255-.028.507-.082.753h.001z"
                fill="#1db954"
              />
            </G>
          </Svg>
          <Text style={styles.logoText}>Spotimusic</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={getTabStyle('home')}
          onPress={() => onTabChange('home')}
        >
          <Text style={getTabTextStyle('home')}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getTabStyle('favorites')}
          onPress={() => onTabChange('favorites')}
        >
          <Text style={getTabTextStyle('favorites')}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getTabStyle('playlists')}
          onPress={() => onTabChange('playlists')}
        >
          <Text style={getTabTextStyle('playlists')}>Playlists</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.playlistsSection}>
        <View style={styles.playlistsHeader}>
          <Text style={styles.playlistsTitle}>Your Library</Text>
        </View>

        <View style={styles.searchContainer}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15 10.5C15 12.9853 12.9853 15 10.5 15C8.01472 15 6 12.9853 6 10.5C6 8.01472 8.01472 6 10.5 6C12.9853 6 15 8.01472 15 10.5ZM14.1793 15.2399C13.1632 16.0297 11.8865 16.5 10.5 16.5C7.18629 16.5 4.5 13.8137 4.5 10.5C4.5 7.18629 7.18629 4.5 10.5 4.5C13.8137 4.5 16.5 7.18629 16.5 10.5C16.5 11.8865 16.0297 13.1632 15.2399 14.1792L20.0304 18.9697L18.9697 20.0303L14.1793 15.2399Z"
              fill="#b3b3b3"
            />
          </Svg>
          <TextInput
            style={styles.searchInput}
            placeholder="Search playlists"
            placeholderTextColor="#b3b3b3"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity style={styles.createButton} onPress={onCreatePlaylist}>
          <Text style={styles.createButtonText}>+ Create playlist</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Playlists</Text>
        <ScrollView 
          style={styles.playlistsList} 
          contentContainerStyle={styles.playlistsListContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredPlaylists.length > 0 ? (
            filteredPlaylists.map((playlist) => (
              <TouchableOpacity
                key={playlist.id}
                style={styles.playlistItem}
                onPress={() => onTabChange('playlists', playlist.id)}
              >
                <View
                  style={[
                    styles.playlistCover,
                    { backgroundColor: playlist.cover ? 'transparent' : '#404040' },
                  ]}
                />
                <View style={styles.playlistInfo}>
                  <Text style={styles.playlistName} numberOfLines={1}>
                    {playlist.name}
                  </Text>
                  <Text style={styles.playlistCount}>
                    {playlist.tracks.length > 0
                      ? `${playlist.tracks.length} tracks`
                      : playlist.name === 'Favorite tracks' || playlist.name === 'Favorite'
                        ? 'Add tracks to favorites'
                        : 'Empty playlist'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>
              {playlists.length === 0 && !searchQuery
                ? 'No playlists yet'
                : 'Nothing found'}
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    backgroundColor: '#000000',
    borderRightWidth: 1,
    borderRightColor: '#282828',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tabs: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 4,
    borderRadius: 4,
  },
  tabActive: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 4,
    borderRadius: 4,
    backgroundColor: '#282828',
  },
  tabText: {
    color: '#b3b3b3',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  playlistsSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  playlistsHeader: {
    marginBottom: 12,
  },
  playlistsTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 32,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
    padding: 0,
  },
  createButton: {
    paddingVertical: 10,
    marginBottom: 16,
  },
  createButtonText: {
    color: '#b3b3b3',
    fontSize: 14,
    fontWeight: '500',
  },
  subtitle: {
    color: '#b3b3b3',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  playlistsList: {
    flex: 1,
  },
  playlistsListContent: {
    flexGrow: 1,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  playlistCover: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  playlistCount: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  emptyText: {
    color: '#b3b3b3',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default Sidebar;
