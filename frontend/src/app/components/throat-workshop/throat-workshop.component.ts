import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/audio.service';
import { ThroatData, GroundingTask } from '../../models/manifestation.model';

export interface SolfeggioHarmonicPreset {
  frequency: number;
  name: string;
  chakra: string;
  benefit: string;
}

@Component({
  selector: 'app-throat-workshop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './throat-workshop.component.html',
  styleUrl: './throat-workshop.component.css'
})
export class ThroatWorkshopComponent implements OnInit, OnDestroy {
  @Input() public intentionTitle: string = 'Current Intention';

  public throatData: ThroatData = {
    spokenDeclaration: '',
    seedMantra: 'HAM',
    dailyAffirmation: '',
    selectedFrequency: 741
  };

  public diagnosticScore: number = 7;
  public masterVolume: number = 0.25;
  public binauralOffset: number = 6;
  public isToneActive: boolean = false;

  public groundingTasks: GroundingTask[] = [
    {
      id: 'task_vocalize',
      label: 'Declare your spoken proclamation aloud with full chest resonance',
      completed: false
    },
    {
      id: 'task_solfeggio',
      label: 'Bathe in 741 Hz Solfeggio sound frequency for 5 minutes',
      completed: false
    },
    {
      id: 'task_boundary',
      label: 'Speak your boundary, pricing, or truth to another without apology',
      completed: false
    }
  ];

  public readonly solfeggioOptions: SolfeggioHarmonicPreset[] = [
    {
      frequency: 741,
      name: '741 Hz',
      chakra: 'Vishuddha (Throat)',
      benefit: 'Intuition, Vocal Sovereignty & Clear Truth Expression'
    },
    {
      frequency: 528,
      name: '528 Hz',
      chakra: 'Manipura / Anahata',
      benefit: 'Transformation, Miracles & DNA Cellular Repair'
    },
    {
      frequency: 432,
      name: '432 Hz',
      chakra: 'Universal Natural Harmonic',
      benefit: 'Deep Stillness, Organic Resonance & Mental Peace'
    },
    {
      frequency: 639,
      name: '639 Hz',
      chakra: 'Anahata (Heart)',
      benefit: 'Interpersonal Harmony & Open Receptivity'
    },
    {
      frequency: 852,
      name: '852 Hz',
      chakra: 'Ajna (Third Eye)',
      benefit: 'Spiritual Order & Perceptive Knowing'
    },
    {
      frequency: 963,
      name: '963 Hz',
      chakra: 'Sahasrara (Crown)',
      benefit: 'Pure Cosmic Consciousness & Divine Architecture'
    }
  ];

  constructor(private readonly audioService: AudioService) {}

  public ngOnInit(): void {
    this.throatData.spokenDeclaration = `I speak the tangible manifestation of "${this.intentionTitle}" into reality. My voice carries sovereignty and truth.`;
    this.throatData.dailyAffirmation = 'I vocalize my highest standard with absolute clarity and calm conviction.';
    this.throatData.seedMantra = 'HAM - My truth commands form.';
  }

  public ngOnDestroy(): void {
    if (this.isToneActive) {
      this.audioService.stopHarmonicTone();
    }
  }

  public toggleHarmonicSound(): void {
    if (this.isToneActive) {
      this.audioService.stopHarmonicTone();
      this.isToneActive = false;
    } else {
      this.audioService.playHarmonicTone(
        this.throatData.selectedFrequency,
        this.binauralOffset,
        this.masterVolume
      );
      this.isToneActive = true;
    }
  }

  public selectFrequency(frequency: number): void {
    this.throatData.selectedFrequency = frequency;
    if (this.isToneActive) {
      this.audioService.playHarmonicTone(frequency, this.binauralOffset, this.masterVolume);
    }
  }

  public onVolumeSliderChange(volumeLevel: number): void {
    this.masterVolume = volumeLevel;
    this.audioService.adjustVolume(volumeLevel);
  }

  public onBinauralSliderChange(offsetHz: number): void {
    this.binauralOffset = offsetHz;
    if (this.isToneActive) {
      this.audioService.playHarmonicTone(
        this.throatData.selectedFrequency,
        this.binauralOffset,
        this.masterVolume
      );
    }
  }

  public speakAloudProclamation(): void {
    const fullSpeechText = `${this.throatData.spokenDeclaration} ${this.throatData.dailyAffirmation}`;
    this.audioService.speakDeclaration(fullSpeechText);
  }

  public toggleGroundingTask(taskId: string): void {
    const targetTask = this.groundingTasks.find(task => task.id === taskId);
    if (targetTask) {
      targetTask.completed = !targetTask.completed;
      if (targetTask.completed) {
        this.audioService.playAlignmentChime(741);
      }
    }
  }
}