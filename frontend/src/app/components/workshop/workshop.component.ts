import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlignmentSpineComponent } from '../alignment-spine/alignment-spine.component';
import { IntentService, IntentionItem } from '../../services/intent.service';

@Component({
  selector: 'app-workshop',
  standalone: true,
  imports: [CommonModule, RouterLink, AlignmentSpineComponent],
  templateUrl: './workshop.component.html',
  styleUrl: './workshop.component.css'
})
export class WorkshopComponent implements OnInit {
  public intentId: string | null = null;
  public currentIntent: IntentionItem | undefined;

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
  }
}