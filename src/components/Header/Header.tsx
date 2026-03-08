import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onGoHome?: () => void;
  showHomeButton?: boolean;
  showProfileButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <View style={styles.container}>
    
      <View style={styles.searchContainer}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 10.5C15 12.9853 12.9853 15 10.5 15C8.01472 15 6 12.9853 6 10.5C6 8.01472 8.01472 6 10.5 6C12.9853 6 15 8.01472 15 10.5ZM14.1793 15.2399C13.1632 16.0297 11.8865 16.5 10.5 16.5C7.18629 16.5 4.5 13.8137 4.5 10.5C4.5 7.18629 7.18629 4.5 10.5 4.5C13.8137 4.5 16.5 7.18629 16.5 10.5C16.5 11.8865 16.0297 13.1632 15.2399 14.1792L20.0304 18.9697L18.9697 20.0303L14.1793 15.2399Z"
            fill="#b3b3b3"
          />
        </Svg>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tracks..."
          placeholderTextColor="#b3b3b3"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#181818',
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  iconButton: {
    padding: 8,
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    marginHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    padding: 0,
  },
});

export default Header;
