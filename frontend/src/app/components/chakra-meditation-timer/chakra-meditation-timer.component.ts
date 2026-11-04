import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-chakra-meditation-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chakra-meditation-timer.component.html',
  styleUrl: './chakra-meditation-timer.component.css'
})
export class ChakraMeditationTimerComponent implements OnDestroy {
  @Input() public chakraName: string = 'Current';
  @Input() public frequencyHz: number = 528;
  @Input() public colorHex: string = '#ffd600';
  @Input() public durationMinutes: number = 5;

  public secondsRemaining: number = 5 * 60;
  public isTimerActive: boolean = false;
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  constructor(public readonly audioService: AudioService) {}

  public ngOnDestroy(): void {
    this.stopSession();
  }

  public setDuration(minutes: number): void {
    if (this.isTimerActive) return;
    this.durationMinutes = minutes;
    this.secondsRemaining = minutes * 60;
  }

  public toggleSession(): void {
    if (this.isTimerActive) {
      this.pauseSession();
    } else {
      this.startSession();
    }
  }

  public resetSession(): void {
    this.pauseSession();
    this.secondsRemaining = this.durationMinutes * 60;
  }

  private startSession(): void {
    this.isTimerActive = true;
    this.audioService.playHarmonicTone(this.frequencyHz, 6, 0.2);

    this.timerInterval = setInterval(() => {
      if (this.secondsRemaining > 0) {
        this.secondsRemaining--;
      } else {
        this.completeSession();
      }
    }, 1000);
  }

  private pauseSession(): void {
    this.isTimerActive = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.audioService.stopHarmonicTone();
  }

  private completeSession(): void {
    this.pauseSession();
    this.audioService.playAlignmentChime(this.frequencyHz);
    this.secondsRemaining = this.durationMinutes * 60;
  }

  private stopSession(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.audioService.isPlaying && this.audioService.currentCarrierFrequency === this.frequencyHz) {
      this.audioService.stopHarmonicTone();
    }
  }

  public formatTimerDisplay(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}