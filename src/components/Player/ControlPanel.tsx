import React, { useEffect, useRef } from 'react';
import VolumeSlider from './VolumeSlider';
import IconButton from '../IconButton/IconButton';
import './Player.css';
import type { Track } from '../../types/music';

interface ControlPanelProps {
  onVolumeChange: (volume: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (seconds: number) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  currentTrack: Track | null;
  isLoading?: boolean;
  hasTrack?: boolean;
  volume: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  onVolumeChange,
  onPlay,
  onPause,
  onSeek,
  onNextTrack,
  onPrevTrack,
  currentTime,
  duration,
  isPlaying,
  currentTrack,
  isLoading = false,
  hasTrack = false,
  volume,
}) => {
  const prevVolumeRef = useRef(volume);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    onSeek(newTime);
  };

  const handleVolumeChangeInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    onVolumeChange(newVolume);
  };

  // Keep last non-zero volume outside of render
  useEffect(() => {
    if (volume > 0) {
      prevVolumeRef.current = volume;
    }
  }, [volume]);

  const isMuted = volume === 0;

  const handleVolumeButtonClick = () => {
    if (isMuted) {
      const restoreVolume = prevVolumeRef.current > 0 ? prevVolumeRef.current : 0.5;
      onVolumeChange(restoreVolume);
    } else {
      prevVolumeRef.current = volume || 0.5;
      onVolumeChange(0);
    }
  };

  return (
    <div className="spotify-player">
      <div className="player-track-info">
        {currentTrack?.image ? (
          <img src={currentTrack.image} alt={currentTrack.name} className="player-track-image" />
        ) : (
          <div className="player-track-image-placeholder">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        )}
        <div className="player-track-details">
          <div className="player-track-name">
            {currentTrack?.name || 'Select track'}
          </div>
          <div className="player-track-artist">
            {currentTrack?.artist || ''}
          </div>
        </div>
      </div>

      <div className="player-main-controls" data-track-name={currentTrack?.name || 'Select track'}>
        <div className="player-controls">
        <IconButton
          variant="prev"
          className="control-btn prev-btn"
          ariaLabel="Previous"
          onClick={onPrevTrack}
          disabled={!hasTrack || !currentTrack}
        />

        <IconButton
          variant={isPlaying ? 'pause' : 'play'}
          className="control-btn play-btn"
          onClick={isPlaying ? onPause : onPlay}
          ariaLabel={isPlaying ? 'Pause' : 'Play'}
          disabled={!hasTrack || isLoading}
        />

        <IconButton
          variant="next"
          className="control-btn next-btn"
          ariaLabel="Next"
          onClick={onNextTrack}
          disabled={!hasTrack || !currentTrack}
        />
      </div>

      <div className="player-progress">
        <span className="time-display">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="progress-bar"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          step="0.1"
          disabled={!hasTrack}
        />
        <span className="time-display">{formatTime(duration)}</span>
      </div>
      </div>

      <div className="player-right-controls">  
        <div className="volume-control">
          <IconButton
            variant={isMuted ? 'volume-mute' : 'volume'}
            className="control-btn volume-btn"
            ariaLabel={isMuted ? 'Unmute' : 'Mute'}
            onClick={handleVolumeButtonClick}
          />
          <VolumeSlider 
            onChange={handleVolumeChangeInternal}
            value={volume}
            min={0}
            max={1}
            step={0.01}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
