import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface IntentionItem {
  id: number | string;
  title: string;
  category: string;
  status: string;
  totalNodes: number;
  alignedNodes: number;
  progressPercentage: number;
}

export interface ActionStep {
  id: number;
  intentionId: number;
  chakraStage: string;
  title: string;
  isCompleted: boolean;
  createdAt?: string;
}

export interface BeliefTransformation {
  id: number;
  intentionId: number;
  limitingBelief: string;
  reframedAffirmation: string;
  actionAnchor: string;
  createdAt?: string;
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
  private readonly apiBaseUrl: string = 'http://localhost:8000'; 

  private readonly intentionsSubject = new BehaviorSubject<IntentionItem[]>([]);
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

  public getActionSteps(intentionId: number | string, chakraStage: string = 'solar_plexus'): Observable<ApiResponse<ActionStep[]>> {
    return this.httpClient.get<ApiResponse<ActionStep[]>>(
      `/api/get_actions.php?intention_id=${intentionId}&chakra_stage=${chakraStage}`
    );
  }

  public createActionStep(intentionId: number | string, title: string, chakraStage: string = 'solar_plexus'): Observable<ApiResponse<ActionStep>> {
    return this.httpClient.post<ApiResponse<ActionStep>>('/api/manage_action.php', {
      actionType: 'create',
      intentionId: Number(intentionId),
      chakraStage,
      title
    });
  }

  public toggleActionStep(actionId: number, isCompleted: boolean): Observable<ApiResponse<void>> {
    return this.httpClient.post<ApiResponse<void>>('/api/manage_action.php', {
      actionType: 'toggle',
      actionId,
      isCompleted
    });
  }

  public getBeliefTransformations(intentionId: number | string): Observable<ApiResponse<BeliefTransformation[]>> {
    return this.httpClient.get<ApiResponse<BeliefTransformation[]>>(
      `/api/ai_reframe.php?intention_id=${intentionId}`
    );
  }

  public reframeLimitingBelief(payload: {
    intentionId: number | string;
    intentionTitle: string;
    limitingBelief: string;
  }): Observable<ApiResponse<BeliefTransformation>> {
    return this.httpClient.post<ApiResponse<BeliefTransformation>>('/api/ai_reframe.php', payload);
  }

  public deleteIntention(intentionId: string | number): Observable<{ status: string; message: string }> {
    return this.httpClient.post<{ status: string; message: string }>(
      '/api/delete_intent.php',
      { id: Number(intentionId) }
    ).pipe(
      tap(() => {
        // Optimistically remove from frontend state
        const updatedList = this.intentionsSubject.value.filter(
          (item) => String(item.id) !== String(intentionId)
        );
        this.intentionsSubject.next(updatedList);
      })
    );
  }
}