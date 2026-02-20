import React from 'react';
import './Player.css';

interface VolumeSliderProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  const volumePercent = ((value - min) / (max - min)) * 100;

  return (
    <div className="volume-slider-wrapper">
      <input
        type="range"
        className="volume-slider"
        onChange={onChange}
        value={value}
        min={min}
        max={max}
        step={step}
        aria-label="Volume control"
        style={{
          background: `linear-gradient(to right, #ffffff 0%, #ffffff ${volumePercent}%, #535353 ${volumePercent}%, #535353 100%)`
        }}
      />
    </div>
  );
};

export default VolumeSlider;
