import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlignmentSpineComponent } from '../alignment-spine/alignment-spine.component';
import { SacralWorkshopComponent } from '../sacral-workshop/sacral-workshop.component';
import { IntentService, IntentionItem, ActionStep, BeliefTransformation } from '../../services/intent.service';
import { AudioService } from '../../services/audio.service';
import { CHAKRA_LIST, CHAKRA_DICTIONARY } from '../../utils/chakras.data';
import { ChakraIdentifier, ChakraMetadata } from '../../models/manifestation.model';

@Component({
  selector: 'app-workshop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AlignmentSpineComponent, SacralWorkshopComponent],
  templateUrl: './workshop.component.html',
  styleUrl: './workshop.component.css'
})
export class WorkshopComponent implements OnInit {
  public intentId: string | null = null;
  public currentIntent: IntentionItem | undefined;
  
  // Navigation Tabs State
  public readonly chakraTabs: ChakraMetadata[] = CHAKRA_LIST;
  public readonly chakraDictionary = CHAKRA_DICTIONARY;
  public activeChakraId: ChakraIdentifier = 'solarPlexus';

  // Action Matrix state (Solar Plexus)
  public actionSteps: ActionStep[] = [];
  public newActionTitle: string = '';
  public isAddingAction: boolean = false;

  // Belief Breaker state (Solar Plexus)
  public limitingBeliefInput: string = '';
  public isReframing: boolean = false;
  public beliefTransformations: BeliefTransformation[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly intentService: IntentService,
    private readonly audioService: AudioService
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

  public selectChakra(id: ChakraIdentifier): void {
    this.activeChakraId = id;
    // Play subtle Solfeggio chime on transition
    const chakra = this.chakraDictionary[id];
    if (chakra) {
      this.audioService.playAlignmentChime(chakra.frequencyHz);
    }
  }

  public get currentChakra(): ChakraMetadata {
    return this.chakraDictionary[this.activeChakraId];
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
    if (step.isCompleted) {
      this.audioService.playAlignmentChime(528);
    }
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
      }
    });
  }

  public adoptAnchorAsAction(actionAnchorText: string): void {
    if (!this.intentId) return;
    this.newActionTitle = actionAnchorText;
    this.handleAddAction();
  }
}