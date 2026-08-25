export * from './risk';
export * from './geo';
export * from './fieldReport';
export * from './alert';
export * from './responseTask';
export * from './weather';
export * from './auth';
export * from './riskEngine';
export * from './vision';
export * from './notification';

export interface AppNotification {
  id: string;
  type: 'CRITICAL_ALERT' | 'HIGH_ALERT' | 'NEW_REPORT' | 'TASK_ASSIGNED' | 'SIMULATION_UPDATE';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export type SupportedLanguage = 'en' | 'hi';
