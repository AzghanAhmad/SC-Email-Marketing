import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Flow, FlowTemplate } from './mock-data.service';

@Injectable({ providedIn: 'root' })
export class FlowApiService {
  constructor(private api: ApiService) {}

  getTemplates(): Observable<FlowTemplate[]> {
    return this.api.get<FlowTemplate[]>('/flow-templates');
  }

  getMyFlows(): Observable<Flow[]> {
    return this.api.get<Flow[]>('/flows');
  }

  installTemplate(templateId: string): Observable<Flow> {
    return this.api.post<Flow>('/flows/install', { templateId });
  }

  updateFlow(id: string, data: Partial<Flow>): Observable<Flow> {
    return this.api.put<Flow>(`/flows/${id}`, data);
  }

  deleteFlow(id: string): Observable<void> {
    return this.api.delete<void>(`/flows/${id}`);
  }
}
