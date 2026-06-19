import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DashboardStats {
  totalSubscribers: number;
  subscriberGrowth: number;
  emailsSent: number;
  emailsGrowth: number;
  openRate: number;
  openRateGrowth: number;
  revenue: number;
  revenueGrowth: number;
}

export interface PerformanceSummary {
  totalRevenue: number;
  totalRevenueChange: number;
  attributedRevenue: number;
  attributedRevenueChange: number;
  periodLabel: string;
}

export interface AttributionItem {
  label: string;
  value: string;
  pct: string;
  icon: string;
}

export interface CampaignChartPoint {
  label: string;
  sent: number;
  opened: number;
}

export interface SubscriberGrowthPoint {
  label: string;
  count: number;
}

export interface DashboardActivity {
  id: string;
  type: string;
  message: string;
  time: string;
  icon: string;
}

export interface DashboardData {
  stats: DashboardStats;
  performance: PerformanceSummary;
  attribution: AttributionItem[];
  campaignChart: CampaignChartPoint[];
  growthChart: SubscriberGrowthPoint[];
  recentActivity: DashboardActivity[];
  periodStart: string;
  periodEnd: string;
  welcomeName: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  constructor(private api: ApiService) {}

  getDashboard(): Observable<DashboardData> {
    return this.api.get<DashboardData>('/dashboard');
  }
}
