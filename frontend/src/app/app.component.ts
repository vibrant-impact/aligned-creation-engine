import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AudioService } from './services/audio.service';
import { CHAKRA_LIST } from './utils/chakras.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public title: string = 'The Creation Engine';
  public selectedFrequency: number = 528;
  public readonly availableChakras = CHAKRA_LIST;

  constructor(public readonly audioService: AudioService) {}

  public toggleTonePlayback(): void {
    if (this.audioService.isPlaying) {
      this.audioService.stopHarmonicTone();
    } else {
      this.audioService.playHarmonicTone(this.selectedFrequency, 6, 0.2);
    }
  }

  public handleFrequencySelection(event: Event): void {
    const targetElement = event.target as HTMLSelectElement;
    this.selectedFrequency = Number(targetElement.value);
    if (this.audioService.isPlaying) {
      this.audioService.playHarmonicTone(this.selectedFrequency, 6, 0.2);
    }
  }
}