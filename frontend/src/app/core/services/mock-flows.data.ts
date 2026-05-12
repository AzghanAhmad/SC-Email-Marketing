import { Flow } from './mock-data.service';
import { ONBOARDING_FLOWS } from './flows-onboarding.data';
import { TRANSACTION_FLOWS } from './flows-transaction.data';
import { LAUNCH_FLOWS } from './flows-launch.data';
import { RETENTION_FLOWS } from './flows-retention.data';

export const FLOWS_DATA: Flow[] = [
  ...ONBOARDING_FLOWS,
  ...TRANSACTION_FLOWS,
  ...LAUNCH_FLOWS,
  ...RETENTION_FLOWS,
];
