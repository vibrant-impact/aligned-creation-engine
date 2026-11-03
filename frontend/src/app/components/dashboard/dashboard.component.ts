import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IntentService, IntentionItem } from '../../services/intent.service';
import { AudioService } from '../../services/audio.service';
import { AlignmentSpineComponent } from '../alignment-spine/alignment-spine.component';
import { GoalModalComponent } from '../goal-modal/goal-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AlignmentSpineComponent, GoalModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  public intentions$!: Observable<IntentionItem[]>;
  public isGoalModalOpen: boolean = false;
  public deletingIntentionId: string | number | null = null;

  constructor(
    private readonly intentService: IntentService,
    private readonly audioService: AudioService,
    private readonly router: Router
  ) {
    this.intentions$ = this.intentService.intentions$;
  }

  public ngOnInit(): void {
    this.intentService.fetchIntentions();
  }

  public openModal(): void {
    this.isGoalModalOpen = true;
  }

  public closeModal(): void {
    this.isGoalModalOpen = false;
  }

  public navigateToWorkshop(intentionId: string | number): void {
    this.router.navigate(['/workshop', intentionId]);
  }

  public handleDeleteIntention(event: Event, intention: IntentionItem): void {
    event.stopPropagation();
    event.preventDefault();

    const confirmed = window.confirm(
      `Are you sure you want to dissolve "${intention.title}"? This will delete all associated actions, notes, and milestones.`
    );

    if (!confirmed) return;

    this.deletingIntentionId = intention.id;

    this.intentService.deleteIntention(intention.id).subscribe({
      next: () => {
        this.deletingIntentionId = null;
        this.audioService.playAlignmentChime(396);
      },
      error: (error) => {
        console.error('Failed to dissolve intention:', error);
        this.deletingIntentionId = null;
      }
    });
  }
}