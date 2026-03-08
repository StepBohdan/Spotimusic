import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native';
import Svg, { Path, Rect, G, Circle } from 'react-native-svg';

export type IconVariant =
  | 'play'
  | 'pause'
  | 'next'
  | 'prev'
  | 'favorite'
  | 'shuffle'
  | 'repeat-one'
  | 'repeat'
  | 'volume'
  | 'volume-mute';

interface IconButtonProps {
  variant: IconVariant;
  style?: ViewStyle;
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  size?: number;
  iconColor?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  variant,
  style,
  active = false,
  disabled = false,
  onPress,
  size = 24,
  iconColor: customIconColor,
}) => {
  const renderIcon = () => {
    const iconColor = customIconColor || (active ? '#1db954' : '#ffffff');
    
    switch (variant) {
      case 'play':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill={iconColor}>
            <Path d="M8 5v14l11-7z" />
          </Svg>
        );
      case 'pause':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill={iconColor}>
            <Path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </Svg>
        );
      case 'next':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill={iconColor}>
            <Path d="M6 6 L16 12 L6 18 Z" />
            <Rect x="18" y="6" width="2" height="12" />
          </Svg>
        );
      case 'prev':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill={iconColor}>
            <Rect x="4" y="6" width="2" height="12" />
            <Path d="M18 6 L8 12 L18 18 Z" />
          </Svg>
        );
      case 'favorite':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill={active ? "#ff404c" : 'none'} stroke={active ? "#ff404c" : iconColor} strokeWidth="2">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
            />
          </Svg>
        );
      case 'shuffle':
        return (
          <Svg width={size} height={size} viewBox="0 0 512 512" fill={iconColor}>
            <G>
              <Path d="M512,387.67L405.406,281.024v84.694h-10.435c-48.766,0-80.203-28.752-108.698-68.925 c-7.856,12.825-16.14,26.159-25.113,39.387c32.329,41.052,73.081,73.424,133.81,73.424h10.435v84.686L512,387.67z" />
            </G>
            <G>
              <Path d="M512,124.355L405.406,17.71v84.695h-10.435c-92.763,0-138.917,75.524-179.637,142.158 c-39.73,65.009-74.04,121.155-142.191,121.155H0v43.886h73.143c92.763,0,138.917-75.524,179.637-142.158 c39.73-65.011,74.04-121.157,142.191-121.157h10.435v84.686L512,124.355z" />
            </G>
            <G>
              <Path d="M73.143,102.404H0v43.886h73.143c48.766,0,80.203,28.752,108.698,68.925c7.856-12.825,16.14-26.159,25.113-39.387 C174.624,134.774,133.872,102.404,73.143,102.404z" />
            </G>
          </Svg>
        );
      case 'repeat-one':
        return (
          <Svg width={size} height={size} viewBox="0 0 256 256" fill={iconColor}>
            <G fillRule="evenodd">
              <Path d="M109.533 197.602a1.887 1.887 0 0 1-.034 2.76l-7.583 7.066a4.095 4.095 0 0 1-5.714-.152l-32.918-34.095c-1.537-1.592-1.54-4.162-.002-5.746l33.1-34.092c1.536-1.581 4.11-1.658 5.74-.18l7.655 6.94c.82.743.833 1.952.02 2.708l-21.11 19.659s53.036.129 71.708.064c18.672-.064 33.437-16.973 33.437-34.7 0-7.214-5.578-17.64-5.578-17.64-.498-.99-.273-2.444.483-3.229l8.61-8.94c.764-.794 1.772-.632 2.242.364 0 0 9.212 18.651 9.212 28.562 0 28.035-21.765 50.882-48.533 50.882-26.769 0-70.921.201-70.921.201l20.186 19.568z" />
              <Path d="M144.398 58.435a1.887 1.887 0 0 1 .034-2.76l7.583-7.066a4.095 4.095 0 0 1 5.714.152l32.918 34.095c1.537 1.592 1.54 4.162.002 5.746l-33.1 34.092c-1.536 1.581-4.11 1.658-5.74.18l-7.656-6.94c-.819-.743-.832-1.952-.02-2.708l21.111-19.659s-53.036-.129-71.708-.064c-18.672.064-33.437 16.973-33.437 34.7 0 7.214 5.578 17.64 5.578 17.64.498.99.273 2.444-.483 3.229l-8.61 8.94c-.764.794-1.772.632-2.242-.364 0 0-9.212-18.65-9.212-28.562 0-28.035 21.765-50.882 48.533-50.882 26.769 0 70.921-.201 70.921-.201l-20.186-19.568z" />
              <Path d="M127.992 104.543l6.53.146c1.105.025 2.013.945 2.027 2.037l.398 30.313a1.97 1.97 0 0 0 2.032 1.94l4.104-.103a1.951 1.951 0 0 1 2.01 1.958l.01 4.838a2.015 2.015 0 0 1-1.99 2.024l-21.14.147a1.982 1.982 0 0 1-1.994-1.983l-.002-4.71c0-1.103.897-1.997 1.996-1.997h4.254a2.018 2.018 0 0 0 2.016-1.994l.169-16.966-6.047 5.912-6.118-7.501 11.745-14.061z" />
            </G>
          </Svg>
        );
      case 'repeat':
        return (
          <Svg width={size} height={size} viewBox="0 0 256 256" fill={iconColor}>
            <G fillRule="evenodd">
              <Path d="M109.533 197.602a1.887 1.887 0 0 1-.034 2.76l-7.583 7.066a4.095 4.095 0 0 1-5.714-.152l-32.918-34.095c-1.537-1.592-1.54-4.162-.002-5.746l33.1-34.092c1.536-1.581 4.11-1.658 5.74-.18l7.655 6.94c.82.743.833 1.952.02 2.708l-21.11 19.659s53.036.129 71.708.064c18.672-.064 33.437-16.973 33.437-34.7 0-7.214-5.578-17.64-5.578-17.64-.498-.99-.273-2.444.483-3.229l8.61-8.94c.764-.794 1.772-.632 2.242.364 0 0 9.212 18.651 9.212 28.562 0 28.035-21.765 50.882-48.533 50.882-26.769 0-70.921.201-70.921.201l20.186 19.568z" />
              <Path d="M144.398 58.435a1.887 1.887 0 0 1 .034-2.76l7.583-7.066a4.095 4.095 0 0 1 5.714.152l32.918 34.095c1.537 1.592 1.54 4.162.002 5.746l-33.1 34.092c-1.536 1.581-4.11 1.658-5.74.18l-7.656-6.94c-.819-.743-.832-1.952-.02-2.708l21.111-19.659s-53.036-.129-71.708-.064c-18.672.064-33.437 16.973-33.437 34.7 0 7.214 5.578 17.64 5.578 17.64.498.99.273 2.444-.483 3.229l-8.61 8.94c-.764.794-1.772.632-2.242-.364 0 0-9.212-18.65-9.212-28.562 0-28.035 21.765-50.882 48.533-50.882 26.769 0 70.921-.201 70.921-.201l-20.186-19.568z" />
            </G>
          </Svg>
        );
      case 'volume':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill={iconColor}>
            <Path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </Svg>
        );
      case 'volume-mute':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill={iconColor}>
            <Path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            <Path d="M23 3L2 19" stroke={iconColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          </Svg>
        );
      default:
        return null;
    }
  };

  const iconContent = (
    <View style={styles.iconContainer}>
      {renderIcon()}
    </View>
  );

  // Если onPress не передан, рендерим обычный View (для использования внутри TouchableOpacity)
  if (!onPress) {
    return (
      <View style={[styles.button, style, disabled && styles.disabled]}>
        {iconContent}
      </View>
    );
  }

  // Если onPress передан, рендерим TouchableOpacity
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {iconContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default IconButton;
