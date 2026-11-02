import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlignmentSpineComponent } from '../alignment-spine/alignment-spine.component';
import { IntentService, IntentionItem, ActionStep, BeliefTransformation } from '../../services/intent.service';

@Component({
  selector: 'app-workshop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AlignmentSpineComponent],
  templateUrl: './workshop.component.html',
  styleUrl: './workshop.component.css'
})
export class WorkshopComponent implements OnInit {
  public intentId: string | null = null;
  public currentIntent: IntentionItem | undefined;
  
  // Action Matrix state
  public actionSteps: ActionStep[] = [];
  public newActionTitle: string = '';
  public isAddingAction: boolean = false;

  // Belief Breaker state
  public limitingBeliefInput: string = '';
  public isReframing: boolean = false;
  public beliefTransformations: BeliefTransformation[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly intentService: IntentService
  ) {}

  public ngOnInit(): void {
    this.intentId = this.route.snapshot.paramMap.get('id');

    this.intentService.intentions$.subscribe((intentions) => {
      this.currentIntent = intentions.find(
        (item) => String(item.id) === String(this.intentId)
      );
    });

    if (this.intentId) {
      this.loadActionSteps();
      this.loadBeliefTransformations();
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
    if (!this.intentId) return;
    this.intentService.getActionSteps(this.intentId).subscribe({
      next: (response) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          this.actionSteps = response.data;
        }
      },
      error: () => {
        this.actionSteps = [
          { id: 1, intentionId: Number(this.intentId), chakraStage: 'solar_plexus', title: 'Define MVP milestone deliverables', isCompleted: true },
          { id: 2, intentionId: Number(this.intentId), chakraStage: 'solar_plexus', title: 'Schedule 2-hour uninterrupted deep work block', isCompleted: false },
          { id: 3, intentionId: Number(this.intentId), chakraStage: 'solar_plexus', title: 'Publish preliminary build to portfolio staging', isCompleted: false }
        ];
      }
    });
  }

  public handleAddAction(): void {
    const trimmedTitle = this.newActionTitle.trim();
    if (!trimmedTitle || !this.intentId) return;

    this.isAddingAction = true;
    this.intentService.createActionStep(this.intentId, trimmedTitle).subscribe({
      next: (response) => {
        this.isAddingAction = false;
        this.newActionTitle = '';
        if (response.status === 'success' && response.data) {
          this.actionSteps.push(response.data);
        } else {
          this.loadActionSteps();
        }
      },
      error: () => {
        this.isAddingAction = false;
        this.actionSteps.push({
          id: Date.now(),
          intentionId: Number(this.intentId),
          chakraStage: 'solar_plexus',
          title: trimmedTitle,
          isCompleted: false
        });
        this.newActionTitle = '';
      }
    });
  }

  public handleToggleAction(step: ActionStep): void {
    step.isCompleted = !step.isCompleted;
    this.intentService.toggleActionStep(step.id, step.isCompleted).subscribe({
      error: (error) => console.warn('Could not persist toggle status to backend:', error)
    });
  }

  public loadBeliefTransformations(): void {
    if (!this.intentId) return;
    this.intentService.getBeliefTransformations(this.intentId).subscribe({
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
    if (!trimmedBelief || !this.intentId) return;

    this.isReframing = true;
    const payload = {
      intentionId: this.intentId,
      intentionTitle: this.currentIntent ? this.currentIntent.title : 'My Vision',
      limitingBelief: trimmedBelief
    };

    this.intentService.reframeLimitingBelief(payload).subscribe({
      next: (response) => {
        this.isReframing = false;
        this.limitingBeliefInput = '';
        if (response.status === 'success' && response.data) {
          this.beliefTransformations.unshift(response.data);
        }
      },
      error: (error) => {
        this.isReframing = false;
        console.error('Reframing failed:', error);
        alert('Could not reframe belief. Check server logs.');
      }
    });
  }

  public adoptAnchorAsAction(actionAnchorText: string): void {
    if (!this.intentId) return;
    this.newActionTitle = actionAnchorText;
    this.handleAddAction();
  }
}