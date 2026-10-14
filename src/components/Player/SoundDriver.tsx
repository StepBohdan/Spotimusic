import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

class SoundDriver {
  private player: AudioPlayer | null = null;
  private statusSubscription: { remove: () => void } | null = null;
  private pausedAt = 0;
  private isRunning = false;
  private volume = 1;
  private onEndedCallback?: () => void;
  private audioUrl: string;
  private duration = 0;
  private currentTime = 0;

  constructor(audioUrl: string, initialVolume = 1) {
    this.audioUrl = audioUrl;
    this.volume = initialVolume;
  }

  static showError(error: string) {
    return error;
  }

  public async init(_parent: any) {
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'duckOthers',
      });

      // Remote URL as string — supported by expo-audio
      const player = createAudioPlayer(this.audioUrl, { updateInterval: 250 });
      player.volume = this.volume;
      player.loop = false;

      this.statusSubscription = player.addListener('playbackStatusUpdate', (status) => {
        if (status.duration > 0) {
          this.duration = status.duration;
        }
        this.currentTime = status.currentTime;
        this.pausedAt = status.currentTime;
        this.isRunning = status.playing;

        if (status.didJustFinish) {
          this.isRunning = false;
          this.pausedAt = 0;
          this.currentTime = 0;
          this.onEndedCallback?.();
        }
      });

      this.player = player;
    } catch (error) {
      console.error('Error initializing audio:', error);
      throw new Error('Failed to load audio');
    }
  }

  public setOnEnded(callback: () => void) {
    this.onEndedCallback = callback;
  }

  public getDuration() {
    return this.duration || this.player?.duration || 0;
  }

  public getCurrentTime() {
    return this.player?.currentTime ?? this.currentTime;
  }

  public async play() {
    if (!this.player) {
      throw new Error('Audio not initialized');
    }

    if (this.isRunning) {
      return;
    }

    try {
      this.player.volume = this.volume;
      if (this.pausedAt > 0) {
        await this.player.seekTo(this.pausedAt);
      }
      this.player.play();
      this.isRunning = true;
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  public async pause(reset?: boolean) {
    if (!this.player) {
      return;
    }

    try {
      this.pausedAt = reset ? 0 : this.player.currentTime;
      this.player.pause();
      this.isRunning = false;
      if (reset) {
        await this.player.seekTo(0);
        this.currentTime = 0;
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  }

  public async seek(seconds: number) {
    if (!this.player) return;

    try {
      const duration = this.player.duration || Infinity;
      const t = Math.max(0, Math.min(seconds, duration));
      await this.player.seekTo(t);
      this.pausedAt = t;
      this.currentTime = t;
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  }

  public changeVolume(volume: number) {
    this.volume = volume;
    if (this.player) {
      this.player.volume = volume;
    }
  }

  public async unload() {
    try {
      this.statusSubscription?.remove();
      this.statusSubscription = null;
      if (this.player) {
        this.player.pause();
        this.player.remove();
        this.player = null;
      }
    } catch (error) {
      console.error('Error unloading audio:', error);
      this.player = null;
    }
  }
}

export default SoundDriver;
