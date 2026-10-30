import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface IntentionItem {
  id: number | string;
  title: string;
  category: string;
  status: string;
  totalNodes: number;
  alignedNodes: number;
  progressPercentage: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isModalOpen: boolean = false;
  isSubmitting: boolean = false;
  newGoalTitle: string = '';
  newGoalCategory: string = '';

  intentions: IntentionItem[] = [
    {
      id: 1,
      title: 'Launch Creative Studio',
      category: 'Career & Business',
      status: 'active',
      totalNodes: 7,
      alignedNodes: 5,
      progressPercentage: 71
    },
    {
      id: 2,
      title: 'Publish My Novel',
      category: 'Creative Expression',
      status: 'active',
      totalNodes: 7,
      alignedNodes: 3,
      progressPercentage: 43
    },
    {
      id: 3,
      title: 'Vibrant Health & Energy',
      category: 'Vitality & Body',
      status: 'active',
      totalNodes: 7,
      alignedNodes: 6,
      progressPercentage: 86
    }
  ];

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.fetchIntentions();
  }

  openGoalModal(event?: Event): void {
    if (event) event.preventDefault();
    this.isModalOpen = true;
  }

  closeGoalModal(): void {
    this.isModalOpen = false;
    this.newGoalTitle = '';
    this.newGoalCategory = '';
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeGoalModal();
    }
  }

  fetchIntentions(): void {
    this.httpClient.get<{ status: string; data: IntentionItem[] }>('/api/get_intentions.php').subscribe({
      next: (response) => {
        if (response.status === 'success' && Array.isArray(response.data) && response.data.length > 0) {
          this.intentions = response.data;
        }
      },
      error: (fetchError) => {
        console.warn('API fetch failed, displaying default local seed data:', fetchError);
      }
    });
  }

  handleGoalSubmit(): void {
    if (!this.newGoalTitle.trim() || !this.newGoalCategory) {
      return;
    }

    this.isSubmitting = true;
    const payload = {
      title: this.newGoalTitle.trim(),
      category: this.newGoalCategory
    };

    this.httpClient.post<{ status: string; message: string }>('/api/create_intent.php', payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.status === 'success') {
          this.closeGoalModal();
          this.fetchIntentions();
        }
      },
      error: (submitError) => {
        this.isSubmitting = false;
        console.error('Error creating intention:', submitError);
        alert('Could not create intent. Check backend status.');
      }
    });
  }
}