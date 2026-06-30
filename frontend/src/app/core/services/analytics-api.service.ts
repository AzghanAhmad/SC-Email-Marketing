import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface AnalyticsKpi {
  label: string;
  value: string;
  change: number;
  iconKey: string;
}

export interface VolumeDataPoint {
  label: string;
  sent: number;
  delivered: number;
}

export interface EngagementTrendPoint {
  label: string;
  open: number;
  click: number;
}

export interface EngagementBreakdown {
  label: string;
  value: number;
  color: string;
}

export interface CampaignFunnelRow {
  name: string;
  sent: number;
  delivered: number;
  opens: number;
  clicks: number;
  purchases: number;
  revenue: string;
}

export interface MetricCard {
  label: string;
  value: string;
  change: number;
  color: string;
  sparkline: string;
}

export interface MetricDetailRow {
  name: string;
  current: string;
  previous: string;
  changeNum: number;
  spark: string;
}

export interface FlowStepRow {
  step: string;
  entered: number;
  completed: number;
  delivered: number;
  opens: number;
  clicks: number;
  revenue: string;
}

export interface GoalExitRate {
  name: string;
  rate: number;
  note: string;
}

export interface SendAuditRow {
  subscriber: string;
  flow: string;
  step: string;
  reason: string;
  time: string;
}

export interface DeliverabilityMetric {
  name: string;
  rate: string;
  recommended: string;
  statusClass: string;
}

export interface DeliveryReportRow {
  name: string;
  sent: number;
  delivered: number;
  bounced: number;
  rate: number;
}

export interface BounceStat {
  label: string;
  value: string;
  pct: string;
  iconKey: string;
}

export interface BouncedEmailRow {
  email: string;
  type: string;
  reason: string;
  date: string;
}

export interface ScoreHistoryPoint {
  label: string;
  score: number;
}

export interface BenchmarkRow {
  metric: string;
  yours: string;
  yoursNum: number;
  industry: string;
  industryNum: number;
  yourColor: string;
}

export interface ListHealthKpi {
  label: string;
  value: string;
  desc: string;
  color: string;
}

export interface ListHealthTrendPoint {
  month: string;
  active: number;
  inactive: number;
}

export interface ListHealthOutcome {
  name: string;
  count: number;
  pct: number;
  color: string;
}

export interface FlaggedSubscriber {
  email: string;
  lastEngaged: string;
  daysInactive: number;
  status: string;
  statusClass: string;
  threshold: string;
}

export interface CustomReport {
  name: string;
  type: string;
  description: string;
  lastUpdated: string;
  iconKey: string;
}

export interface AnalyticsBundle {
  kpis: AnalyticsKpi[];
  volumeData: VolumeDataPoint[];
  engagementTrend: EngagementTrendPoint[];
  engagementBreakdown: EngagementBreakdown[];
  campaignFunnel: CampaignFunnelRow[];
  metrics: MetricCard[];
  metricDetails: MetricDetailRow[];
  flowSteps: FlowStepRow[];
  goalExitRates: GoalExitRate[];
  sendAuditRows: SendAuditRow[];
  deliverabilityScore: number;
  scoreChange: number;
  scoreHistory: ScoreHistoryPoint[];
  deliverabilityMetrics: DeliverabilityMetric[];
  deliveryReports: DeliveryReportRow[];
  bounceStats: BounceStat[];
  bouncedEmails: BouncedEmailRow[];
  benchmarks: BenchmarkRow[];
  listHealthKpis: ListHealthKpi[];
  listHealthTrend: ListHealthTrendPoint[];
  listHealthOutcomes: ListHealthOutcome[];
  flaggedQueue: FlaggedSubscriber[];
  customReports: CustomReport[];
}

@Injectable({ providedIn: 'root' })
export class AnalyticsApiService {
  constructor(private api: ApiService) {}

  getAnalytics(days = 30): Observable<AnalyticsBundle> {
    return this.api.get<AnalyticsBundle>(`/analytics?days=${days}`);
  }
}
