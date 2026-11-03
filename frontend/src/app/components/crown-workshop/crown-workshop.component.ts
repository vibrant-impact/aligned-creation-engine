import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/audio.service';
import { CrownData, GroundingTask } from '../../models/manifestation.model';

@Component({
  selector: 'app-crown-workshop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crown-workshop.component.html',
  styleUrl: './crown-workshop.component.css'
})
export class CrownWorkshopComponent implements OnInit {
  @Input() public intentionTitle: string = 'Current Intention';

  public crownData: CrownData = {
    missionStatement: '',
    higherWhy: '',
    cosmicAnchorPhrase: ''
  };

  public diagnosticScore: number = 8;

  public groundingTasks: GroundingTask[] = [
    {
      id: 'task_mission',
      label: 'Clarify core mission statement and higher soul purpose',
      completed: true
    },
    {
      id: 'task_surrender',
      label: 'Commit intention to the downward Current of Manifestation with zero gripping',
      completed: false
    },
    {
      id: 'task_service',
      label: 'Identify who is elevated or healed once this creation occupies physical reality',
      completed: false
    }
  ];

  constructor(public readonly audioService: AudioService) {}

  public ngOnInit(): void {
    this.crownData.missionStatement = `To fully actualize "${this.intentionTitle}" into physical existence as a pillar of alignment, mastery, and sovereign contribution.`;
    this.crownData.higherWhy = 'Creation is the highest expression of aligned service. By grounding this vision, I elevate my reality and expand what is possible for others.';
    this.crownData.cosmicAnchorPhrase = `I anchor the divine blueprint of "${this.intentionTitle}" into tangible physical reality now.`;
  }

  public playCrownTone(): void {
    // 963 Hz corresponds to Sahasrara (Crown) for pure cosmic awareness and blueprint clarity
    this.audioService.playHarmonicTone(963, 6, 0.2);
  }

  public stopCrownTone(): void {
    this.audioService.stopHarmonicTone();
  }

  public speakAnchorPhrase(): void {
    const textToVocalize = `${this.crownData.cosmicAnchorPhrase} ${this.crownData.missionStatement}`;
    this.audioService.speakDeclaration(textToVocalize);
  }

  public toggleGroundingTask(taskId: string): void {
    const targetTask = this.groundingTasks.find(task => task.id === taskId);
    if (targetTask) {
      targetTask.completed = !targetTask.completed;
      if (targetTask.completed) {
        this.audioService.playAlignmentChime(963);
      }
    }
  }
}