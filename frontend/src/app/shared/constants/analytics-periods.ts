export interface PeriodOption {
  value: number;
  label: string;
}

export const ANALYTICS_PERIOD_OPTIONS: PeriodOption[] = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 365, label: 'Last year' },
];

export const LIST_HEALTH_PERIOD_OPTIONS: PeriodOption[] = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 180, label: 'Last 6 months' },
];

export const CONVERSION_METRIC_OPTIONS = [
  { value: 'placed_order', label: 'Placed Order' },
  { value: 'clicked_link', label: 'Clicked Link' },
  { value: 'opened_email', label: 'Opened Email' },
];

export const LIST_HEALTH_STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'queued', label: 'Queued' },
  { value: 'in-sequence', label: 'In sequence' },
];
