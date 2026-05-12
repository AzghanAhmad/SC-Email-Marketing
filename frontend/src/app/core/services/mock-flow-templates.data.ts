import { FlowTemplate } from './mock-data.service';
import { ONBOARDING_TEMPLATES } from './flow-templates-onboarding.data';
import { TRANSACTION_TEMPLATES } from './flow-templates-transaction.data';
import { LAUNCH_TEMPLATES } from './flow-templates-launch.data';
import { RETENTION_TEMPLATES } from './flow-templates-retention.data';

export const FLOW_TEMPLATES_DATA: FlowTemplate[] = [
  ...ONBOARDING_TEMPLATES,
  ...TRANSACTION_TEMPLATES,
  ...LAUNCH_TEMPLATES,
  ...RETENTION_TEMPLATES,
];
