import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/audio.service';
import { GroundingTask } from '../../models/manifestation.model';

export interface MilestoneItem {
  id: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface ManifestationPhase {
  phaseNumber: number;
  phaseName: string;
  focus: string;
  milestones: MilestoneItem[];
}

@Component({
  selector: 'app-root-workshop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './root-workshop.component.html',
  styleUrl: './root-workshop.component.css'
})
export class RootWorkshopComponent implements OnInit {
  @Input() public intentionTitle: string = 'Current Intention';

  public diagnosticScore: number = 8;
  public physicalAnchorEvidence: string = '';

  // 3-Phase Milestone Ladder
  public manifestationPhases: ManifestationPhase[] = [
    {
      phaseNumber: 1,
      phaseName: 'Foundation & Baseline Assets',
      focus: 'Set up immutable infrastructure, environments, and core architectures.',
      milestones: [
        { id: 'm1_1', title: 'Complete domain setup, repo init, and environment variables', dueDate: 'Week 1', isCompleted: true },
        { id: 'm1_2', title: 'Draft system design blueprint and core API specs', dueDate: 'Week 2', isCompleted: true }
      ]
    },
    {
      phaseNumber: 2,
      phaseName: 'Kinetic Momentum & Tangible Artifacts',
      focus: 'Build visible working interfaces, database persistence, and end-to-end flows.',
      milestones: [
        { id: 'm2_1', title: 'Deploy functional beta build to staging environment', dueDate: 'Week 4', isCompleted: false },
        { id: 'm2_2', title: 'Conduct thorough user-flow testing and interface audit', dueDate: 'Week 5', isCompleted: false }
      ]
    },
    {
      phaseNumber: 3,
      phaseName: 'Sovereign Physical Realization',
      focus: 'Public distribution, client transactions, and long-term physical anchoring.',
      milestones: [
        { id: 'm3_1', title: 'Launch production release to open audience / target market', dueDate: 'Week 8', isCompleted: false },
        { id: 'm3_2', title: 'Collect first real-world returns and solidify ongoing operations', dueDate: 'Week 9', isCompleted: false }
      ]
    }
  ];

  // Dynamic milestone adder
  public targetPhaseNumber: number = 1;
  public newMilestoneTitle: string = '';
  public newMilestoneDueDate: string = '';

  public groundingTasks: GroundingTask[] = [
    {
      id: 'task_root_environment',
      label: 'Physically clear, organize, and anchor your desk workstation',
      completed: true
    },
    {
      id: 'task_root_frequency',
      label: 'Ground into 396 Hz Muladhara harmonic resonance for 5 minutes',
      completed: false
    },
    {
      id: 'task_root_body',
      label: 'Plant feet flat on earth and acknowledge your physical form holding this reality',
      completed: false
    }
  ];

  constructor(public readonly audioService: AudioService) {}

  public ngOnInit(): void {
    this.physicalAnchorEvidence = `Concrete physical assets, deployed web code, clear financial tracking, and established operating routines for "${this.intentionTitle}".`;
  }

  public get totalMilestonesCount(): number {
    return this.manifestationPhases.reduce((acc, phase) => acc + phase.milestones.length, 0);
  }

  public get completedMilestonesCount(): number {
    return this.manifestationPhases.reduce(
      (acc, phase) => acc + phase.milestones.filter(m => m.isCompleted).length,
      0
    );
  }

  public get completionPercentage(): number {
    if (this.totalMilestonesCount === 0) return 0;
    return Math.round((this.completedMilestonesCount / this.totalMilestonesCount) * 100);
  }

  public toggleMilestone(milestone: MilestoneItem): void {
    milestone.isCompleted = !milestone.isCompleted;
    if (milestone.isCompleted) {
      // 396 Hz Muladhara base chime
      this.audioService.playAlignmentChime(396);
    }
  }

  public handleAddMilestone(): void {
    const trimmedTitle = this.newMilestoneTitle.trim();
    if (!trimmedTitle) return;

    const targetPhase = this.manifestationPhases.find(p => p.phaseNumber === Number(this.targetPhaseNumber));
    if (targetPhase) {
      targetPhase.milestones.push({
        id: 'm_' + Date.now(),
        title: trimmedTitle,
        dueDate: this.newMilestoneDueDate.trim() || 'Pending',
        isCompleted: false
      });
      this.newMilestoneTitle = '';
      this.newMilestoneDueDate = '';
      this.audioService.playAlignmentChime(396);
    }
  }

  public removeMilestone(phaseNumber: number, milestoneId: string): void {
    const targetPhase = this.manifestationPhases.find(p => p.phaseNumber === phaseNumber);
    if (targetPhase) {
      targetPhase.milestones = targetPhase.milestones.filter(m => m.id !== milestoneId);
    }
  }

  public playRootTone(): void {
    this.audioService.playHarmonicTone(396, 4, 0.22);
  }

  public stopRootTone(): void {
    this.audioService.stopHarmonicTone();
  }

  public toggleGroundingTask(taskId: string): void {
    const targetTask = this.groundingTasks.find(task => task.id === taskId);
    if (targetTask) {
      targetTask.completed = !targetTask.completed;
      if (targetTask.completed) {
        this.audioService.playAlignmentChime(396);
      }
    }
  }
}