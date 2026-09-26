export { legacySchema } from './schema.js';

export const delogLevels = { trace: 1, debug: 2, info: 3, warn: 4, error: 5, fatal: 6 } as const;
export const delogLevelsText = {
  1: 'trace',
  2: 'debug',
  3: 'info',
  4: 'warn',
  5: 'error',
  6: 'fatal',
} as const;
export type DelogLevel = keyof typeof delogLevels;
export type Severity = (typeof delogLevels)[DelogLevel];
export interface SourceContext {
  repository: { provider: string; name: string; branch: string; commit: string; basePath: string };
  caller: { file: string; line: number; column: number };
}
export interface DelogInputRecordContext {
  mode?: 'TESTING' | 'LOGGING';
  suite?: string;
  scenario?: string;
  sharedID?: string;
  sharedOrder?: number;
  call?: SourceContext;
}
export interface DelogInputRecord {
  text: string;
  time: number;
  level: number;
  unit?: 's' | 'ms' | 'us';
  project?: string;
  space?: string;
  format?: string;
  method?: string;
  error?: string;
  extradata?: string;
  context?: DelogInputRecordContext;
}
export interface LoggedRecord extends DelogInputRecord {
  id: string;
  log: string;
  project: string;
  space: string;
  format: string;
  receivedAt: number;
}
export interface RecordQuery {
  count?: number;
  start?: string;
  project?: string;
  space?: string;
  level?: number;
  search?: string;
  sharedID?: string;
  from?: number;
  to?: number;
}
export interface RecordPage {
  records: LoggedRecord[];
  next: string | null;
}
export const entityKinds = [
  'projects',
  'spaces',
  'tokens',
  'formats',
  'testers',
  'notifiers',
  'providers',
  'repositories',
] as const;
export type EntityKind = (typeof entityKinds)[number];
export interface Entity {
  id: string;
  [field: string]: unknown;
}
export interface TesterConfiguration {
  phases: { text: string; level?: number | DelogLevel; method?: string }[];
  startDelay: number;
  retryDelay: number;
  timeout: number;
}
export interface TestResult {
  id: string;
  time: number;
  status: boolean;
  tester: string;
  phasesStatus: number[];
}
export interface Analytics {
  total: number;
  faults: number;
  bytes: number;
  levels: { name: DelogLevel; value: number }[];
  timeline: { time: number; total: number; faults: number }[];
  pendingNotifications: number;
  failedNotifications: number;
}
export const RECORD_MUTATION = `mutation DelogMutationRecord($input: DelogInputRecord!) {
  delogMutationRecord(input: $input) { status error { code message } }
}`;
export type DelogInputRecordContextCall = SourceContext;
export type DelogInputRecordContextRepository = SourceContext['repository'];
export type DelogInputRecordContextCaller = SourceContext['caller'];
