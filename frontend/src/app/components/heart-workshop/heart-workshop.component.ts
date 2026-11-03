import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/audio.service';
import { PreGratitudeEntry, GroundingTask } from '../../models/manifestation.model';

@Component({
  selector: 'app-heart-workshop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './heart-workshop.component.html',
  styleUrl: './heart-workshop.component.css'
})
export class HeartWorkshopComponent implements OnInit, OnDestroy {
  @Input() public intentionTitle: string = 'Current Intention';

  public diagnosticScore: number = 8;
  public somaticResonanceNotes: string = '';
  public preGratitudeEntries: PreGratitudeEntry[] = [];

  public newEntryText: string = '';
  public newEntryFeeling: string = '';

  // 0.1 Hz Heart-Brain Coherence Breathing Pacer (5s Inhale / 2s Hold / 5s Exhale)
  public isBreathingPacerActive: boolean = false;
  public breathPhase: 'Inhale' | 'Hold' | 'Exhale' = 'Inhale';
  public phaseSecondsRemaining: number = 5;
  public completedBreathCycles: number = 0;
  private pacerInterval: ReturnType<typeof setInterval> | null = null;

  public groundingTasks: GroundingTask[] = [
    {
      id: 'task_pregratitude',
      label: 'Record 2 pre-gratitude entries giving thanks as if already manifested',
      completed: true
    },
    {
      id: 'task_coherence',
      label: 'Complete a 3-minute Heart-Brain Coherence breathing session (0.1 Hz)',
      completed: false
    },
    {
      id: 'task_release_gripping',
      label: 'Notice and release any physical gripping or desperation in the chest cavity',
      completed: false
    }
  ];

  constructor(public readonly audioService: AudioService) {}

  public ngOnInit(): void {
    this.somaticResonanceNotes = 'Chest soft, shoulders dropped, radiating unconditional trust in the divine timing of complete alignment.';
    this.preGratitudeEntries = [
      {
        id: 'pg_init_1',
        text: `Deep gratitude for the effortless manifestation and sovereign fulfillment of "${this.intentionTitle}".`,
        feelingTone: 'Warm expansive release in chest cavity',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'pg_init_2',
        text: `Thank you for the peace of mind knowing all physical and spiritual resources are already provided for this creation.`,
        feelingTone: 'Rooted calm, gratitude, and stillness',
        date: new Date().toISOString().split('T')[0]
      }
    ];
  }

  public ngOnDestroy(): void {
    this.stopBreathingPacer();
  }

  // Coherence Pacer controls
  public toggleBreathingPacer(): void {
    if (this.isBreathingPacerActive) {
      this.stopBreathingPacer();
    } else {
      this.startBreathingPacer();
    }
  }

  private startBreathingPacer(): void {
    this.isBreathingPacerActive = true;
    this.breathPhase = 'Inhale';
    this.phaseSecondsRemaining = 5;

    // 639 Hz corresponds to Anahata (Heart) for emotional coherence and openness
    if (!this.audioService.isPlaying) {
      this.audioService.playHarmonicTone(639, 6, 0.18);
    }

    this.pacerInterval = setInterval(() => {
      if (this.phaseSecondsRemaining > 1) {
        this.phaseSecondsRemaining--;
      } else {
        // Transition phases
        if (this.breathPhase === 'Inhale') {
          this.breathPhase = 'Hold';
          this.phaseSecondsRemaining = 2;
        } else if (this.breathPhase === 'Hold') {
          this.breathPhase = 'Exhale';
          this.phaseSecondsRemaining = 5;
        } else {
          this.breathPhase = 'Inhale';
          this.phaseSecondsRemaining = 5;
          this.completedBreathCycles++;
        }
      }
    }, 1000);
  }

  private stopBreathingPacer(): void {
    this.isBreathingPacerActive = false;
    if (this.pacerInterval) {
      clearInterval(this.pacerInterval);
      this.pacerInterval = null;
    }
  }

  // Pre-Gratitude Entries
  public handleAddGratitudeEntry(): void {
    const trimmedText = this.newEntryText.trim();
    if (!trimmedText) return;

    const newEntry: PreGratitudeEntry = {
      id: 'pg_' + Date.now(),
      text: trimmedText,
      feelingTone: this.newEntryFeeling.trim() || 'Warm expansive lightness',
      date: new Date().toISOString().split('T')[0]
    };

    this.preGratitudeEntries.unshift(newEntry);
    this.newEntryText = '';
    this.newEntryFeeling = '';
    this.audioService.playAlignmentChime(639);
  }

  public handleRemoveGratitudeEntry(entryId: string): void {
    this.preGratitudeEntries = this.preGratitudeEntries.filter(entry => entry.id !== entryId);
  }

  public toggleGroundingTask(taskId: string): void {
    const targetTask = this.groundingTasks.find(task => task.id === taskId);
    if (targetTask) {
      targetTask.completed = !targetTask.completed;
      if (targetTask.completed) {
        this.audioService.playAlignmentChime(639);
      }
    }
  }
}