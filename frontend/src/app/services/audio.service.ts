import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext | null = null;
  private oscillatorLeft: OscillatorNode | null = null;
  private oscillatorRight: OscillatorNode | null = null;
  private masterGainNode: GainNode | null = null;

  public isPlaying: boolean = false;
  public currentCarrierFrequency: number = 528;

  private initializeAudioContext(): void {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  public playHarmonicTone(carrierFrequency: number, binauralOffsetFrequency: number = 6, masterVolume: number = 0.2): void {
    this.initializeAudioContext();
    if (!this.audioContext) return;

    if (this.isPlaying) {
      this.stopHarmonicTone();
    }

    this.currentCarrierFrequency = carrierFrequency;
    const currentTime = this.audioContext.currentTime;

    // Master Gain with smooth exponential rise
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.gain.setValueAtTime(0.001, currentTime);
    this.masterGainNode.gain.exponentialRampToValueAtTime(masterVolume, currentTime + 0.3);
    this.masterGainNode.connect(this.audioContext.destination);

    // Left channel carrier oscillator
    this.oscillatorLeft = this.audioContext.createOscillator();
    this.oscillatorLeft.type = 'sine';
    this.oscillatorLeft.frequency.setValueAtTime(carrierFrequency, currentTime);

    // Right channel carrier oscillator with binaural detuning
    this.oscillatorRight = this.audioContext.createOscillator();
    this.oscillatorRight.type = 'sine';
    this.oscillatorRight.frequency.setValueAtTime(carrierFrequency + binauralOffsetFrequency, currentTime);

    // Stereo panning separation for binaural beat induction
    if (this.audioContext.createStereoPanner) {
      const stereoPannerLeft = this.audioContext.createStereoPanner();
      stereoPannerLeft.pan.setValueAtTime(-0.85, currentTime);
      this.oscillatorLeft.connect(stereoPannerLeft);
      stereoPannerLeft.connect(this.masterGainNode);

      const stereoPannerRight = this.audioContext.createStereoPanner();
      stereoPannerRight.pan.setValueAtTime(0.85, currentTime);
      this.oscillatorRight.connect(stereoPannerRight);
      stereoPannerRight.connect(this.masterGainNode);
    } else {
      this.oscillatorLeft.connect(this.masterGainNode);
      this.oscillatorRight.connect(this.masterGainNode);
    }

    this.oscillatorLeft.start(currentTime);
    this.oscillatorRight.start(currentTime);
    this.isPlaying = true;
  }

  public adjustVolume(volumeLevel: number): void {
    if (this.masterGainNode && this.audioContext) {
      const currentTime = this.audioContext.currentTime;
      this.masterGainNode.gain.setValueAtTime(this.masterGainNode.gain.value, currentTime);
      this.masterGainNode.gain.linearRampToValueAtTime(Math.max(0.001, volumeLevel), currentTime + 0.1);
    }
  }

  public stopHarmonicTone(): void {
    if (!this.audioContext || !this.isPlaying) return;

    const currentTime = this.audioContext.currentTime;
    if (this.masterGainNode) {
      this.masterGainNode.gain.setValueAtTime(this.masterGainNode.gain.value, currentTime);
      this.masterGainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + 0.25);
    }

    setTimeout(() => {
      try {
        this.oscillatorLeft?.stop();
        this.oscillatorRight?.stop();
        this.oscillatorLeft?.disconnect();
        this.oscillatorRight?.disconnect();
      } catch {
        // Safe disconnection fallback
      }
      this.oscillatorLeft = null;
      this.oscillatorRight = null;
      this.masterGainNode = null;
      this.isPlaying = false;
    }, 280);
  }

  public playAlignmentChime(baseFrequency: number = 741): void {
    this.initializeAudioContext();
    if (!this.audioContext) return;

    const currentTime = this.audioContext.currentTime;
    const chimeOscillator = this.audioContext.createOscillator();
    const chimeGain = this.audioContext.createGain();

    chimeOscillator.type = 'triangle';
    chimeOscillator.frequency.setValueAtTime(baseFrequency, currentTime);
    chimeOscillator.frequency.exponentialRampToValueAtTime(baseFrequency * 1.5, currentTime + 0.12);

    chimeGain.gain.setValueAtTime(0.001, currentTime);
    chimeGain.gain.linearRampToValueAtTime(0.25, currentTime + 0.05);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, currentTime + 1.4);

    chimeOscillator.connect(chimeGain);
    chimeGain.connect(this.audioContext.destination);

    chimeOscillator.start(currentTime);
    chimeOscillator.stop(currentTime + 1.5);
  }

  public speakDeclaration(declarationText: string): void {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const speechUtterance = new SpeechSynthesisUtterance(declarationText);
    speechUtterance.rate = 0.9;
    speechUtterance.pitch = 1.0;

    const availableVoices = window.speechSynthesis.getVoices();
    const naturalVoice = availableVoices.find(
      (voice) => voice.lang.startsWith('en') && (voice.name.includes('Natural') || voice.name.includes('Samantha') || voice.name.includes('Google'))
    );

    if (naturalVoice) {
      speechUtterance.voice = naturalVoice;
    }

    window.speechSynthesis.speak(speechUtterance);
  }
}