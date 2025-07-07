// Audio Effects Utility for BoundaryCore
// Centralized audio management for UI feedback sounds

export class AudioEffects {
  private static audioContext: AudioContext | null = null;

  private static getAudioContext(): AudioContext | null {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      return this.audioContext;
    } catch (error) {
      console.log('Audio not available');
      return null;
    }
  }

  // Gentle bubble-pop sound for dialog opens
  static playBubblePop(): void {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();

    // Configure filter for bubble-like sound
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
    filterNode.Q.setValueAtTime(1, audioContext.currentTime);

    // Start with higher frequency and quickly drop (bubble pop effect)
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);

    // Quick attack and fast decay for pop effect
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

    // Connect nodes
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  }

  // Achievement unlock chime - triumphant but subtle
  static playAchievementUnlock(): void {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;

    // Create multiple oscillators for a pleasant chord
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const osc3 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();

    // Configure filter for warm sound
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(2000, audioContext.currentTime);
    filterNode.Q.setValueAtTime(0.5, audioContext.currentTime);

    // Achievement chord: C major (C-E-G)
    osc1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    osc2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
    osc3.frequency.setValueAtTime(783.99, audioContext.currentTime); // G5

    // Gentle attack with sustained tone and soft decay
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.1); // Gentle volume
    gainNode.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + 0.4); // Sustain
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2); // Fade out

    // Connect all oscillators through filter and gain
    osc1.connect(filterNode);
    osc2.connect(filterNode);
    osc3.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Play the chord
    const startTime = audioContext.currentTime;
    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    osc1.stop(startTime + 1.2);
    osc2.stop(startTime + 1.2);
    osc3.stop(startTime + 1.2);
  }

  // Level up sound - more celebratory than achievement unlock
  static playLevelUp(): void {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;

    // Create ascending melody for level up
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C-E-G-C octave
    let startTime = audioContext.currentTime;

    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();

      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(1500, audioContext.currentTime);
      
      oscillator.frequency.setValueAtTime(freq, startTime);
      
      // Quick note envelope
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.25);

      startTime += 0.15; // Overlap notes slightly
    });
  }

  // Streak milestone sound - encouraging but not overwhelming
  static playStreakMilestone(): void {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();

    // Configure for bright, uplifting sound
    filterNode.type = 'bandpass';
    filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
    filterNode.Q.setValueAtTime(2, audioContext.currentTime);

    // Frequency sweep upward for optimistic feel
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(660, audioContext.currentTime + 0.3);
    oscillator.frequency.linearRampToValueAtTime(880, audioContext.currentTime + 0.6);

    // Gentle build and fade
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.8);
  }
}