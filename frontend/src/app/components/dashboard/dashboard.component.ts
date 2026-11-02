import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IntentService, IntentionItem } from '../../services/intent.service';
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
  public intentions$: Observable<IntentionItem[]>;
  public isGoalModalOpen: boolean = false;

  constructor(
    private readonly intentService: IntentService,
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

  public navigateToWorkshop(intentId: number | string): void {
    this.router.navigate(['/workshop', intentId]);
  }
}