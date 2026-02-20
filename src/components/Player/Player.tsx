import { useCallback, useRef, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setIsPlaying as setReduxIsPlaying, clearPlayPauseRequests, type PlaybackMode } from '../../store/slices/playerSlice';
import SoundDriver from './SoundDriver';
import ControlPanel from './ControlPanel';
import './Player.css';
import type { Track } from '../../types/music';

interface PlayerProps {
  currentTrack: Track | null;
  allTracks: Track[];
  onTrackEnd: () => void;
  onTrackChange: (track: Track | null) => void;
}

function Player({ currentTrack, allTracks, onTrackEnd, onTrackChange }: PlayerProps) {
  const dispatch = useAppDispatch();
  const playRequested = useAppSelector((state) => state.player.playRequested);
  const pauseRequested = useAppSelector((state) => state.player.pauseRequested);
  const playbackMode = useAppSelector((state) => state.player.playbackMode);
  const soundController = useRef<undefined | SoundDriver>(undefined);
  const previousTrackIdRef = useRef<string | number | null>(null);
  const wasPlayingRef = useRef(false);
  const onTrackChangeRef = useRef(onTrackChange);
  const onTrackEndRef = useRef(onTrackEnd);
  const volumeRef = useRef(0.5);
  const playbackModeRef = useRef<PlaybackMode>('sequential');
  
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [hasTrack, setHasTrack] = useState(false);
  
  useEffect(() => {
    onTrackChangeRef.current = onTrackChange;
    onTrackEndRef.current = onTrackEnd;
    volumeRef.current = volume;
    playbackModeRef.current = playbackMode;
  }, [onTrackChange, onTrackEnd, volume, playbackMode]);


  useEffect(() => {
    dispatch(setReduxIsPlaying(isPlaying));
  }, [isPlaying, dispatch]);

  const handlePlay = useCallback(async () => {
    if (!soundController.current) return;
    try {
      await soundController.current.play();
      setIsPlaying(true);
      wasPlayingRef.current = true;
    } catch (error) {
      console.error('Error playing:', error);
    }
  }, []);

  const handlePause = useCallback(async () => {
    if (!soundController.current) return;
    try {
      await soundController.current.pause();
      setIsPlaying(false);
      wasPlayingRef.current = false;
    } catch (error) {
      console.error('Error pausing:', error);
    }
  }, []);

  // Handle play/pause requests from Redux
  useEffect(() => {
    if (playRequested && soundController.current && !isPlaying) {
      handlePlay();
      dispatch(clearPlayPauseRequests());
    }
  }, [playRequested, isPlaying, handlePlay, dispatch]);

  useEffect(() => {
    if (pauseRequested && soundController.current && isPlaying) {
      handlePause();
      dispatch(clearPlayPauseRequests());
    }
  }, [pauseRequested, isPlaying, handlePause, dispatch]);

  useEffect(() => {
    if (!soundController.current) return;

    const interval = setInterval(() => {
      if (soundController.current) {
        const time = soundController.current.getCurrentTime();
        setCurrentTime(time);
        const dur = soundController.current.getDuration();
        if (dur && dur > 0 && dur !== duration) {
          setDuration(dur);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  useEffect(() => {
    const loadTrack = async () => {
      if (!currentTrack) {
        if (soundController.current) {
          await soundController.current.pause(true);
          soundController.current = undefined;
        }
        setHasTrack(false);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        previousTrackIdRef.current = null;
        wasPlayingRef.current = false;
        return;
      }

      // If it's the same track, don't reload it (unless it's a forced reload)
      if (previousTrackIdRef.current === currentTrack.id && soundController.current) {
        // Only reload if volume changed significantly or other critical changes
        return;
      }

      const audioUrl = currentTrack.audioUrl || currentTrack.preview_url;
      if (!audioUrl) {
        console.warn('No audio URL for track:', currentTrack);
        setLoading(false);
        setHasTrack(false);
        alert('This track is not available for playback');
        return;
      }
      
      console.log('Loading track:', currentTrack.name, 'URL:', audioUrl);

      setLoading(true);
      try {
        // Stop previous track
        if (soundController.current) {
          await soundController.current.pause(true);
        }

        const soundInstance = new SoundDriver(audioUrl, volumeRef.current);
        soundInstance.setOnEnded(() => {
          setIsPlaying(false);

          // Repeat the same track if repeat-one mode is enabled
          if (playbackModeRef.current === 'repeat-one') {
            try {
              soundInstance.seek(0);
              soundInstance.play();
              setIsPlaying(true);
              wasPlayingRef.current = true;
            } catch (repeatError) {
              console.error('Error repeating track:', repeatError);
              onTrackEndRef.current();
            }
            return;
          }

          // Shuffle mode: pick a random track from the current list
          if (playbackModeRef.current === 'shuffle') {
            if (allTracks.length === 0 || !currentTrack) {
              onTrackEndRef.current();
              return;
            }

            let nextIndex = 0;
            if (allTracks.length === 1) {
              nextIndex = 0;
            } else {
              const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
              do {
                nextIndex = Math.floor(Math.random() * allTracks.length);
              } while (nextIndex === currentIndex && allTracks.length > 1);
            }

            onTrackChangeRef.current(allTracks[nextIndex]);
            return;
          }

       
          if (currentTrack && allTracks.length > 0) {
            const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
            if (currentIndex === -1) {
              onTrackChangeRef.current(allTracks[0]);
            } else if (currentIndex < allTracks.length - 1) {
              onTrackChangeRef.current(allTracks[currentIndex + 1]);
            } else {
              onTrackChangeRef.current(allTracks[0]);
            }
          } else {
            onTrackEndRef.current();
          }
        });

        await soundInstance.init(null);
        soundController.current = soundInstance;
        setHasTrack(true);
        const trackDuration = soundInstance.getDuration();
        setDuration(trackDuration || 0);
        setCurrentTime(0);
        setLoading(false);
        
   
        try {
          await soundInstance.play();
          setIsPlaying(true);
          wasPlayingRef.current = true;
        } catch (playError) {
          console.error('Error playing track:', playError);
          setLoading(false);
          wasPlayingRef.current = false;
        }
        
        previousTrackIdRef.current = currentTrack.id;
      } catch (err: unknown) {
        console.error('Error loading track:', err);
        setLoading(false);
        setHasTrack(false);
        wasPlayingRef.current = false;
      }
    };

    loadTrack();
  }, [currentTrack, allTracks]);


  const handleSeek = useCallback((seconds: number) => {
    if (!soundController.current) return;
    try {
      soundController.current.seek(seconds);
      setCurrentTime(seconds);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    soundController.current?.changeVolume(newVolume);
  }, []);

  const handleNextTrack = useCallback(() => {
    if (!currentTrack || !allTracks.length) return;

    if (playbackMode === 'shuffle') {
      let nextIndex = 0;
      if (allTracks.length === 1) {
        nextIndex = 0;
      } else {
        const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
        do {
          nextIndex = Math.floor(Math.random() * allTracks.length);
        } while (nextIndex === currentIndex && allTracks.length > 1);
      }

      onTrackChange(allTracks[nextIndex]);
      return;
    }

    const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);

    if (currentIndex === -1) {
      onTrackChange(allTracks[0]);
    } else if (currentIndex < allTracks.length - 1) {
      onTrackChange(allTracks[currentIndex + 1]);
    } else {
      onTrackChange(allTracks[0]);
    }
  }, [currentTrack, allTracks, onTrackChange, playbackMode]);

  const handlePrevTrack = useCallback(() => {
    if (!currentTrack) return;
    const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      onTrackChange(allTracks[currentIndex - 1]);
    }
  }, [currentTrack, allTracks, onTrackChange]);

  return (
    <div className="player-container">
      <ControlPanel
        onVolumeChange={handleVolumeChange}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={handleSeek}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        currentTrack={currentTrack}
        isLoading={loading}
        hasTrack={hasTrack}
        volume={volume}
      />
    </div>
  );
}

export default Player;
