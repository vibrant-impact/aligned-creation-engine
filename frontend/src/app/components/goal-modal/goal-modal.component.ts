import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IntentService } from '../../services/intent.service';

@Component({
  selector: 'app-goal-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goal-modal.component.html',
  styleUrl: './goal-modal.component.css'
})
export class GoalModalComponent {
  @Input() public isOpen: boolean = false;
  @Output() public readonly closeModal = new EventEmitter<void>();
  @Output() public readonly intentionCreated = new EventEmitter<void>();

  public goalTitle: string = '';
  public goalCategory: string = '';
  public isSubmitting: boolean = false;

  constructor(private readonly intentService: IntentService) {}

  public handleClose(): void {
    this.goalTitle = '';
    this.goalCategory = '';
    this.closeModal.emit();
  }

  public onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.handleClose();
    }
  }

  public handleSubmit(): void {
    if (!this.goalTitle.trim() || !this.goalCategory) {
      return;
    }

    this.isSubmitting = true;
    const payload = {
      title: this.goalTitle.trim(),
      category: this.goalCategory
    };

    this.intentService.createIntent(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.intentionCreated.emit();
        this.goalTitle = '';
        this.goalCategory = '';
        this.closeModal.emit();
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Submission failed:', error);
        alert('Could not create intent. Check backend status.');
      }
    });
  }
}