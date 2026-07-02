import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Flow, FlowStep } from './mock-data.service';

export interface FlowTriggerResult {
  runId: string;
  enrolledCount: number;
  message: string;
}

export interface FlowResults {
  flowId: string;
  totalRuns: number;
  totalEnrollments: number;
  completedEnrollments: number;
  inProgressEnrollments: number;
  runs: { id: string; startedAt: string; status: string; enrolled: number; completed: number }[];
  responses: {
    subscriberName: string;
    subscriberEmail: string;
    stepLabel: string;
    stepType: string;
    responseSummary: string;
    submittedAt: string;
  }[];
}

export interface PublicFlowEnrollment {
  flowName: string;
  subscriberName: string;
  currentStep: FlowStep | null;
  stepIndex: number;
  totalSteps: number;
  completed: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class FlowApiService {
  constructor(private api: ApiService) {}

  getTemplates(): Observable<import('./mock-data.service').FlowTemplate[]> {
    return this.api.get('/flow-templates');
  }

  getMyFlows(): Observable<Flow[]> {
    return this.api.get<Flow[]>('/flows');
  }

  installTemplate(templateId: string): Observable<Flow> {
    return this.api.post<Flow>('/flows/install', { templateId });
  }

  updateFlow(id: string, data: { name?: string; description?: string; status?: string; steps?: FlowStep[] }): Observable<Flow> {
    return this.api.put<Flow>(`/flows/${id}`, data);
  }

  triggerFlow(id: string): Observable<FlowTriggerResult> {
    return this.api.post<FlowTriggerResult>(`/flows/${id}/trigger`, {});
  }

  getFlowResults(id: string): Observable<FlowResults> {
    return this.api.get<FlowResults>(`/flows/${id}/results`);
  }

  deleteFlow(id: string): Observable<void> {
    return this.api.delete<void>(`/flows/${id}`);
  }

  getPublicEnrollment(token: string): Observable<PublicFlowEnrollment> {
    return this.api.get<PublicFlowEnrollment>(`/public/flows/respond/${token}`);
  }

  submitFlowStep(token: string, responses: Record<string, string>): Observable<PublicFlowEnrollment> {
    return this.api.post<PublicFlowEnrollment>(`/public/flows/respond/${token}`, { responses });
  }
}
