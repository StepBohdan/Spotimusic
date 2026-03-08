import { Audio } from 'expo-av';

class SoundDriver {
  private sound: Audio.Sound | null = null;
  private pausedAt = 0;
  private isRunning = false;
  private volume = 1;
  private onEndedCallback?: () => void;
  private audioUrl: string;
  private duration = 0;
  private currentTime = 0;
  private statusUpdateInterval: ReturnType<typeof setInterval> | null = null;

  constructor(audioUrl: string, initialVolume = 1) {
    this.audioUrl = audioUrl;
    this.volume = initialVolume;
  }

  static showError(error: string) {
    return error;
  }

  public async init(_parent: any) {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: this.audioUrl },
        {
          shouldPlay: false,
          volume: this.volume,
          isLooping: false,
        }
      );

      this.sound = sound;

      // Set up status update listener
      this.sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded) {
          if (status.durationMillis) {
            this.duration = status.durationMillis / 1000;
          }
          if (status.positionMillis !== undefined) {
            this.currentTime = status.positionMillis / 1000;
            this.pausedAt = this.currentTime;
          }
          if (status.didJustFinish) {
            this.isRunning = false;
            this.pausedAt = 0;
            this.currentTime = 0;
            if (this.onEndedCallback) {
              this.onEndedCallback();
            }
          }
        }
      });

      return Promise.resolve(undefined);
    } catch (error) {
      console.error('Error initializing audio:', error);
      throw new Error('Failed to load audio');
    }
  }

  public setOnEnded(callback: () => void) {
    this.onEndedCallback = callback;
  }

  public getDuration() {
    return this.duration;
  }

  public getCurrentTime() {
    return this.currentTime;
  }

  public async play() {
    if (!this.sound) {
      throw new Error('Audio not initialized');
    }

    if (this.isRunning) {
      return;
    }

    try {
      await this.sound.setPositionAsync(this.pausedAt * 1000);
      await this.sound.setVolumeAsync(this.volume);
      await this.sound.playAsync();
      this.isRunning = true;
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  public async pause(reset?: boolean) {
    if (!this.sound) {
      return;
    }

    try {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        this.pausedAt = reset ? 0 : status.positionMillis / 1000;
      }
      await this.sound.pauseAsync();
      this.isRunning = false;
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  }

  public async seek(seconds: number) {
    if (!this.sound) return;

    try {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        const duration = status.durationMillis ? status.durationMillis / 1000 : Infinity;
        const t = Math.max(0, Math.min(seconds, duration));
        await this.sound.setPositionAsync(t * 1000);
        this.pausedAt = t;
      }
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  }

  public changeVolume(volume: number) {
    this.volume = volume;
    if (this.sound) {
      this.sound.setVolumeAsync(volume).catch(console.error);
    }
  }

  public async unload() {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

export default SoundDriver;
