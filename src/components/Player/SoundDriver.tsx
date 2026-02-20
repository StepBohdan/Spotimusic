class SoundDriver {
  private audioElement?: HTMLAudioElement;
  private pausedAt = 0;
  private isRunning = false;
  private volume = 1;
  private onEndedCallback?: () => void;

  constructor(audioUrl: string, initialVolume = 1) {
    this.audioElement = new Audio(audioUrl);
    this.volume = initialVolume;
    this.audioElement.volume = initialVolume;
  }

  static showError(error: string) {
    return error;
  }

  public init(_parent: HTMLElement | null) {
    void _parent;
    return new Promise((resolve, reject) => {
      if (!this.audioElement) {
        reject(new Error('Audio element not found'));
        return;
      }

      const handleLoadedMetadata = () => {
        console.log('Audio metadata loaded, duration:', this.audioElement?.duration);
        resolve(undefined);
      };

      const handleError = (e: Event) => {
        console.error('Audio load error:', e);
        reject(new Error('Failed to load audio'));
      };

      const handleCanPlay = () => {
        console.log('Audio can play');
      };

      this.audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      this.audioElement.addEventListener('error', handleError);
      this.audioElement.addEventListener('canplay', handleCanPlay);
      this.audioElement.addEventListener('ended', () => {
        this.isRunning = false;
        this.pausedAt = 0;
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      });

      // Set crossOrigin for CORS
      this.audioElement.crossOrigin = 'anonymous';
      this.audioElement.preload = 'metadata';
      
      this.audioElement.load();
      
      // Timeout in case loading hangs
      setTimeout(() => {
        if (this.audioElement && !this.audioElement.readyState) {
          reject(new Error('Audio load timeout'));
        }
      }, 10000);
    });
  }

  public setOnEnded(callback: () => void) {
    this.onEndedCallback = callback;
  }
  
  public getDuration() {
    return this.audioElement?.duration || 0;
  }

  public getCurrentTime() {
    return this.audioElement?.currentTime || 0;
  }
  
  public async play() {
    if (!this.audioElement) {
      throw new Error('Audio element not found');
    }

    if (this.isRunning) {
      return;
    }

    this.audioElement.volume = this.volume;
    this.audioElement.currentTime = this.pausedAt;
    
    try {
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      this.pausedAt = 0;
      this.isRunning = true;
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  public async pause(reset?: boolean) {
    if (!this.audioElement) {
      return;
    }

    this.audioElement.pause();
    this.pausedAt = reset ? 0 : this.audioElement.currentTime;
    this.isRunning = false;
  }

  public async seek(seconds: number) {
    if (!this.audioElement) return;
  
    const duration = this.audioElement.duration || Infinity;
    const t = Math.max(0, Math.min(seconds, duration));
  
    this.audioElement.currentTime = t;
    this.pausedAt = t;
    
    // If track is playing, update time immediately
    if (this.isRunning) {
      // Time will update automatically via getCurrentTime
    }
  }
  

  public changeVolume(volume: number) {
    this.volume = volume;
    if (this.audioElement) {
      this.audioElement.volume = volume;
    }
  }

}

export default SoundDriver;
