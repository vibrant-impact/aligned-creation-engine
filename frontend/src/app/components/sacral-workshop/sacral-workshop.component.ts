import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  generateSigilGeometry, 
  reduceAffirmationToCharacters, 
  GeneratedSigilGeometry 
} from '../../utils/sigil.engine';
import { AudioService } from '../../services/audio.service';
import { SigilConfig, GroundingTask } from '../../models/manifestation.model';

@Component({
  selector: 'app-sacral-workshop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sacral-workshop.component.html',
  styleUrl: './sacral-workshop.component.css'
})
export class SacralWorkshopComponent implements OnInit, OnDestroy {
  @Input() public intentionTitle: string = 'CREATIVE FLOW';

  public diagnosticScore: number = 8;

  public seedPhraseInput: string = '';
  public uniqueCharacters: string[] = [];
  public seedWord: string = '';
  public sigilGeometry!: GeneratedSigilGeometry;

  public sigilConfig: SigilConfig = {
    symmetry: 8,
    ringCount: 3,
    strokeWidth: 2,
    glow: true,
    geometryType: 'flower'
  };

  // Creative Flow Sprint Timer
  public sprintDurationMinutes: number = 25;
  public secondsRemaining: number = 25 * 60;
  public isSprintActive: boolean = false;
  private sprintTimerInterval: ReturnType<typeof setInterval> | null = null;

  // Stage 2 Grounding Checklist
  public groundingTasks: GroundingTask[] = [
    {
      id: 'task_sacral_sigil',
      label: 'Alchemize intent into a completed sacred geometric sigil',
      completed: true
    },
    {
      id: 'task_sacral_sprint',
      label: 'Complete a 25-minute deep creative flow sprint (417 Hz)',
      completed: false
    },
    {
      id: 'task_sacral_export',
      label: 'Export SVG vector artifact for physical engraving or visual altar placement',
      completed: false
    }
  ];

  constructor(public readonly audioService: AudioService) {}

  public ngOnInit(): void {
    this.seedPhraseInput = this.intentionTitle ? this.intentionTitle.toUpperCase() : 'CREATIVE FLOW';
    this.regenerateSigil();
  }

  public ngOnDestroy(): void {
    this.stopSprintTimer();
  }

  public onSeedPhraseChange(): void {
    this.seedPhraseInput = this.seedPhraseInput.toUpperCase();
    this.regenerateSigil();
  }

  public updateSymmetry(symmetryCount: number): void {
    this.sigilConfig.symmetry = symmetryCount;
    this.regenerateSigil();
  }

  public updateRings(ringCount: number): void {
    this.sigilConfig.ringCount = ringCount;
    this.regenerateSigil();
  }

  public updateStrokeWidth(strokeWidth: number): void {
    this.sigilConfig.strokeWidth = strokeWidth;
    this.regenerateSigil();
  }

  public toggleGlow(): void {
    this.sigilConfig.glow = !this.sigilConfig.glow;
  }

  public regenerateSigil(): void {
    const reductionResult = reduceAffirmationToCharacters(this.seedPhraseInput);
    this.uniqueCharacters = reductionResult.uniqueCharacters;
    this.seedWord = reductionResult.seedWord;

    this.sigilGeometry = generateSigilGeometry(
      this.seedPhraseInput,
      this.sigilConfig.symmetry,
      this.sigilConfig.ringCount,
      this.sigilConfig.geometryType,
      340
    );
  }

  public calculateRosetteX(centerCoordinate: number, ringRadius: number, angleDegrees: number): number {
    const angleInRadians = (angleDegrees * Math.PI) / 180;
    return Number((centerCoordinate + (ringRadius * 0.5) * Math.cos(angleInRadians)).toFixed(2));
  }

  public calculateRosetteY(centerCoordinate: number, ringRadius: number, angleDegrees: number): number {
    const angleInRadians = (angleDegrees * Math.PI) / 180;
    return Number((centerCoordinate + (ringRadius * 0.5) * Math.sin(angleInRadians)).toFixed(2));
  }

  public downloadSvgVector(): void {
    const svgElement = document.getElementById('sacredSigilSvgCanvas');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = `ACE_Sacral_Sigil_${this.seedWord || 'SACRED'}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blobUrl);
    this.audioService.playAlignmentChime(417);
  }

  public toggleSprintTimer(): void {
    if (this.isSprintActive) {
      this.stopSprintTimer();
    } else {
      this.startSprintTimer();
    }
  }

  public resetSprintTimer(): void {
    this.stopSprintTimer();
    this.secondsRemaining = this.sprintDurationMinutes * 60;
  }

  private startSprintTimer(): void {
    this.isSprintActive = true;
    if (!this.audioService.isPlaying) {
      this.audioService.playHarmonicTone(417, 6, 0.18);
    }

    this.sprintTimerInterval = setInterval(() => {
      if (this.secondsRemaining > 0) {
        this.secondsRemaining--;
      } else {
        this.stopSprintTimer();
        this.audioService.playAlignmentChime(417);
      }
    }, 1000);
  }

  private stopSprintTimer(): void {
    this.isSprintActive = false;
    if (this.sprintTimerInterval) {
      clearInterval(this.sprintTimerInterval);
      this.sprintTimerInterval = null;
    }
  }

  public formatTimerDisplay(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  public playSacralTone(): void {
    this.audioService.playHarmonicTone(417, 6, 0.2);
  }

  public stopSacralTone(): void {
    this.audioService.stopHarmonicTone();
  }

  public toggleGroundingTask(taskId: string): void {
    const targetTask = this.groundingTasks.find((task) => task.id === taskId);
    if (targetTask) {
      targetTask.completed = !targetTask.completed;
      if (targetTask.completed) {
        this.audioService.playAlignmentChime(417);
      }
    }
  }
}