import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface IntentionItem {
  id: number | string;
  title: string;
  category: string;
  status: string;
  totalNodes: number;
  alignedNodes: number;
  progressPercentage: number;
}

interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class IntentService {
  private readonly defaultIntentions: IntentionItem[] = [
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

  private readonly intentionsSubject = new BehaviorSubject<IntentionItem[]>(this.defaultIntentions);
  public readonly intentions$ = this.intentionsSubject.asObservable();

  constructor(private readonly httpClient: HttpClient) {}

  public fetchIntentions(): void {
    this.httpClient.get<ApiResponse<IntentionItem[]>>('/api/get_intentions.php').subscribe({
      next: (response) => {
        if (response.status === 'success' && Array.isArray(response.data) && response.data.length > 0) {
          this.intentionsSubject.next(response.data);
        }
      },
      error: (fetchError) => {
        console.warn('API fetch failed, retaining current state:', fetchError);
      }
    });
  }

  public createIntent(payload: { title: string; category: string }): Observable<ApiResponse<IntentionItem>> {
    return this.httpClient.post<ApiResponse<IntentionItem>>('/api/create_intent.php', payload).pipe(
      tap((response) => {
        if (response.status === 'success') {
          this.fetchIntentions();
        }
      })
    );
  }
}