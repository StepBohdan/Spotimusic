import React from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface VolumeSliderProps {
  onChange: (value: number) => void;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({
  onChange,
  value = 0.5,
  min = 0,
  max = 1,
  step = 0.01,
}) => {
  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={onChange}
        minimumTrackTintColor="#ffffff"
        maximumTrackTintColor="#535353"
        thumbTintColor="#ffffff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 40,
    justifyContent: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default VolumeSlider;
