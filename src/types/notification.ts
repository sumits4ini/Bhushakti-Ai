export type NotificationChannel = 'IN_APP' | 'SMS' | 'EMAIL' | 'PUSH';

export interface DispatchRecipient {
  id: string;
  name: string;
  role: 'ADMIN' | 'FIELD_OFFICER' | 'CITIZEN';
  phone?: string;
  email?: string;
  deviceToken?: string;
}

export interface NotificationMessage {
  id: string;
  type: 'CRITICAL_ALERT' | 'HIGH_ALERT' | 'TASK_ASSIGNED' | 'REPORT_VERIFIED' | 'INCIDENT_RESOLVED';
  title: string;
  body: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  districtName: string;
  riskZoneId?: string;
  actionUrl?: string;
  createdAt: string;
  read: boolean;
  channelResults: {
    channel: NotificationChannel;
    status: 'DELIVERED' | 'SIMULATED' | 'DISABLED';
    recipient: string;
    details?: string;
  }[];
}

export interface INotificationChannelAdapter {
  channel: NotificationChannel;
  send(message: NotificationMessage, recipients: DispatchRecipient[]): Promise<boolean>;
}
