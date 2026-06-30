export interface Campaign {
  id: string;
  name: string;
  subject: string;
  previewText?: string;
  content?: string;
  campaignType?: string;
  status: string;
  fromName?: string;
  sendToSegment?: string;
  openRate: number;
  clickRate: number;
  sent: number;
  date: string;
  scheduledAt?: string | null;
  sentAt?: string | null;
  uniqueOpens?: number;
  uniqueClicks?: number;
  conversionRate?: number;
  extras?: Record<string, string>;
}

export interface CalendarEvent {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
  daysFromRelease?: number;
}

export interface NewsletterSchedule {
  name: string;
  frequency: string;
  dayOfWeek: string;
  dayOfMonth: string;
  sendTime: string;
  timezoneOptimized: boolean;
  subject: string;
  previewText: string;
  replyQuestion: string;
  content: string;
  status: string;
}

export interface AbTest {
  id: string;
  name: string;
  subjectA: string;
  subjectB: string;
  testSize: number;
  winnerMetric: string;
  waitHours: number;
  status: string;
  openRateA?: number;
  openRateB?: number;
  winner?: string;
}

export interface CampaignsBundle {
  campaigns: Campaign[];
  calendarEvents: CalendarEvent[];
  newsletter: NewsletterSchedule;
  abTests: AbTest[];
}

export interface CreateCampaignPayload {
  name: string;
  subject: string;
  previewText?: string;
  content?: string;
  campaignType?: string;
  fromName?: string;
  sendToSegment?: string;
  status?: string;
  scheduledAt?: string | null;
  extras?: Record<string, string>;
}

export interface AudienceSegment {
  id: string;
  name: string;
  count: number;
  description: string;
}

export interface ReachEstimate {
  segmentCount: number;
  excludedCount: number;
  estimatedSendCount: number;
}

export interface TestSendResponse {
  message: string;
  sentTo: string;
}
