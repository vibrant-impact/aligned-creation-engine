import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IntentService, ActionStep, BeliefTransformation } from '../../services/intent.service';
import { AudioService } from '../../services/audio.service';
import { GroundingTask } from '../../models/manifestation.model';

@Component({
  selector: 'app-solar-plexus-workshop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solar-plexus-workshop.component.html',
  styleUrl: './solar-plexus-workshop.component.css'
})
export class SolarPlexusWorkshopComponent implements OnInit {
  @Input() public intentionId: string | null = null;
  @Input() public intentionTitle: string = 'Current Intention';

  public diagnosticScore: number = 8;

  // Kinetic Action Matrix
  public actionSteps: ActionStep[] = [];
  public newActionTitle: string = '';
  public isAddingAction: boolean = false;

  // AI Belief Alchemist
  public limitingBeliefInput: string = '';
  public isReframing: boolean = false;
  public beliefTransformations: BeliefTransformation[] = [];

  // Stage 3 Grounding Checklist
  public groundingTasks: GroundingTask[] = [
    {
      id: 'task_sp_alchemize',
      label: 'Identify and transmute at least one limiting doubt into sovereign conviction',
      completed: true
    },
    {
      id: 'task_sp_microaction',
      label: 'Define and complete 1 concrete micro-step within the next 24 hours',
      completed: false
    },
    {
      id: 'task_sp_frequency',
      label: 'Resonate with 528 Hz transformation frequency to dissolve hesitation',
      completed: false
    }
  ];

  constructor(
    private readonly intentService: IntentService,
    public readonly audioService: AudioService
  ) {}

  public ngOnInit(): void {
    if (this.intentionId) {
      this.loadActionSteps();
      this.loadBeliefTransformations();
    } else {
      this.actionSteps = [
        { id: 1, intentionId: 1, chakraStage: 'solar_plexus', title: 'Define MVP milestone deliverables', isCompleted: true },
        { id: 2, intentionId: 1, chakraStage: 'solar_plexus', title: 'Schedule 2-hour uninterrupted deep work block', isCompleted: false },
        { id: 3, intentionId: 1, chakraStage: 'solar_plexus', title: 'Publish preliminary build to portfolio staging', isCompleted: false }
      ];
    }
  }

  public get completedCount(): number {
    return this.actionSteps.filter((step) => step.isCompleted).length;
  }

  public get completionPercentage(): number {
    if (this.actionSteps.length === 0) return 0;
    return Math.round((this.completedCount / this.actionSteps.length) * 100);
  }

  public loadActionSteps(): void {
    if (!this.intentionId) return;
    this.intentService.getActionSteps(this.intentionId).subscribe({
      next: (response) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          this.actionSteps = response.data;
        }
      },
      error: () => {
        this.actionSteps = [
          { id: 1, intentionId: Number(this.intentionId), chakraStage: 'solar_plexus', title: 'Define MVP milestone deliverables', isCompleted: true },
          { id: 2, intentionId: Number(this.intentionId), chakraStage: 'solar_plexus', title: 'Schedule 2-hour uninterrupted deep work block', isCompleted: false },
          { id: 3, intentionId: Number(this.intentionId), chakraStage: 'solar_plexus', title: 'Publish preliminary build to portfolio staging', isCompleted: false }
        ];
      }
    });
  }

  public handleAddAction(): void {
    const trimmedTitle = this.newActionTitle.trim();
    if (!trimmedTitle) return;

    this.isAddingAction = true;
    if (this.intentionId) {
      this.intentService.createActionStep(this.intentionId, trimmedTitle).subscribe({
        next: (response) => {
          this.isAddingAction = false;
          this.newActionTitle = '';
          if (response.status === 'success' && response.data) {
            this.actionSteps.push(response.data);
          } else {
            this.loadActionSteps();
          }
          this.audioService.playAlignmentChime(528);
        },
        error: () => {
          this.isAddingAction = false;
          this.actionSteps.push({
            id: Date.now(),
            intentionId: Number(this.intentionId),
            chakraStage: 'solar_plexus',
            title: trimmedTitle,
            isCompleted: false
          });
          this.newActionTitle = '';
          this.audioService.playAlignmentChime(528);
        }
      });
    } else {
      this.isAddingAction = false;
      this.actionSteps.push({
        id: Date.now(),
        intentionId: 0,
        chakraStage: 'solar_plexus',
        title: trimmedTitle,
        isCompleted: false
      });
      this.newActionTitle = '';
      this.audioService.playAlignmentChime(528);
    }
  }

  public handleToggleAction(step: ActionStep): void {
    step.isCompleted = !step.isCompleted;
    if (step.isCompleted) {
      this.audioService.playAlignmentChime(528);
    }
    if (this.intentionId) {
      this.intentService.toggleActionStep(step.id, step.isCompleted).subscribe({
        error: (error) => console.warn('Could not persist toggle status:', error)
      });
    }
  }

  public loadBeliefTransformations(): void {
    if (!this.intentionId) return;
    this.intentService.getBeliefTransformations(this.intentionId).subscribe({
      next: (response) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          this.beliefTransformations = response.data;
        }
      },
      error: () => {
        this.beliefTransformations = [];
      }
    });
  }

  public handleReframeBelief(): void {
    const trimmedBelief = this.limitingBeliefInput.trim();
    if (!trimmedBelief) return;

    this.isReframing = true;
    const payload = {
      intentionId: this.intentionId || '1',
      intentionTitle: this.intentionTitle,
      limitingBelief: trimmedBelief
    };

    this.intentService.reframeLimitingBelief(payload).subscribe({
      next: (response) => {
        this.isReframing = false;
        this.limitingBeliefInput = '';
        if (response.status === 'success' && response.data) {
          this.beliefTransformations.unshift(response.data);
          this.audioService.playAlignmentChime(528);
        }
      },
      error: (error) => {
        this.isReframing = false;
        console.error('Reframing failed:', error);
      }
    });
  }

  public adoptAnchorAsAction(actionAnchorText: string): void {
    this.newActionTitle = actionAnchorText;
    this.handleAddAction();
  }

  public playSolarPlexusTone(): void {
    this.audioService.playHarmonicTone(528, 6, 0.2);
  }

  public stopSolarPlexusTone(): void {
    this.audioService.stopHarmonicTone();
  }

  public toggleGroundingTask(taskId: string): void {
    const targetTask = this.groundingTasks.find((task) => task.id === taskId);
    if (targetTask) {
      targetTask.completed = !targetTask.completed;
      if (targetTask.completed) {
        this.audioService.playAlignmentChime(528);
      }
    }
  }
}