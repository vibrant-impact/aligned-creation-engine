import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AudioService } from '../../services/audio.service';
import { GoalModalComponent } from '../goal-modal/goal-modal.component';

export interface CurrentStagePresentationItem {
  number: number;
  name: string;
  sanskrit: string;
  frequency: number;
  colorHex: string;
  theme: string;
  transformation: string;
  description: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, GoalModalComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  public isGoalModalOpen: boolean = false;
  public hoveredStageIndex: number | null = null;

  public readonly stages: CurrentStagePresentationItem[] = [
    {
      number: 7,
      name: 'Crown',
      sanskrit: 'Sahasrara',
      frequency: 963,
      colorHex: '#b388ff',
      theme: 'Cosmic Purpose',
      transformation: 'Subtle Thought',
      description: 'Divine blueprint clarification, higher spiritual purpose, and sacred surrender.'
    },
    {
      number: 6,
      name: 'Third Eye',
      sanskrit: 'Ajna',
      frequency: 852,
      colorHex: '#536dfe',
      theme: 'Sensory Vision',
      transformation: 'Mental Imagery',
      description: '4-quadrant multi-sensory holographic visioning and visual anchor curation.'
    },
    {
      number: 5,
      name: 'Throat',
      sanskrit: 'Vishuddha',
      frequency: 741,
      colorHex: '#00e5ff',
      theme: 'Sovereign Truth',
      transformation: 'Acoustic Vibration',
      description: 'Vocal declaration, seed mantras, and pure truth frequency proclamation.'
    },
    {
      number: 4,
      name: 'Heart',
      sanskrit: 'Anahata',
      frequency: 639,
      colorHex: '#00e676',
      theme: 'Pre-Gratitude',
      transformation: 'Emotional Resonance',
      description: '0.1 Hz heart-brain coherence breathing and embodied living in fulfilled completion.'
    },
    {
      number: 3,
      name: 'Solar Plexus',
      sanskrit: 'Manipura',
      frequency: 528,
      colorHex: '#ffd600',
      theme: 'Sovereign Will',
      transformation: 'Kinetic Momentum',
      description: 'AI belief alchemist transmuting hesitation into decisive action matrices.'
    },
    {
      number: 2,
      name: 'Sacral',
      sanskrit: 'Svadhisthana',
      frequency: 417,
      colorHex: '#ff9100',
      theme: 'Sacred Creation',
      transformation: 'Symbolic Form',
      description: 'Austin Osman Spare algorithmic sigil generation and flow state focus sprints.'
    },
    {
      number: 1,
      name: 'Root',
      sanskrit: 'Muladhara',
      frequency: 396,
      colorHex: '#ff1744',
      theme: 'Physical Anchor',
      transformation: 'Dense Matter',
      description: '3-phase physical milestone execution ladders and tangible real-world infrastructure.'
    }
  ];

  constructor(
    private readonly audioService: AudioService,
    private readonly router: Router
  ) {}

  public openInitiationModal(): void {
    this.audioService.playAlignmentChime(528);
    this.isGoalModalOpen = true;
  }

  public closeInitiationModal(): void {
    this.isGoalModalOpen = false;
  }

  public handleStageHover(index: number, frequency: number): void {
    this.hoveredStageIndex = index;
    this.audioService.playAlignmentChime(frequency);
  }

  public clearStageHover(): void {
    this.hoveredStageIndex = null;
  }

  public handleSkipToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}