import {
  NotificationMessage,
  DispatchRecipient,
  INotificationChannelAdapter,
  NotificationChannel,
} from "@/types/notification";
import { Alert } from "@/types/alert";

const NOTIFICATIONS_STORAGE_KEY = "bhushakti_in_app_notifications";

class InAppNotificationAdapter implements INotificationChannelAdapter {
  channel: NotificationChannel = "IN_APP";
  async send(message: NotificationMessage, recipients: DispatchRecipient[]): Promise<boolean> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const list: NotificationMessage[] = stored ? JSON.parse(stored) : [];
      list.unshift(message);
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list.slice(0, 30)));
    }
    return true;
  }
}

class SmsNotificationAdapter implements INotificationChannelAdapter {
  channel: NotificationChannel = "SMS";
  async send(message: NotificationMessage, recipients: DispatchRecipient[]): Promise<boolean> {
    // In production, would invoke SMS Gateway (e.g. CDAC NIC SMS / Twilio)
    console.info(`[SMS SIMULATOR] Dispatching P1 Alert SMS to ${recipients.length} responders: "${message.title}"`);
    return true;
  }
}

class EmailNotificationAdapter implements INotificationChannelAdapter {
  channel: NotificationChannel = "EMAIL";
  async send(message: NotificationMessage, recipients: DispatchRecipient[]): Promise<boolean> {
    // In production, would invoke SMTP / SendGrid / Postmark
    console.info(`[EMAIL SIMULATOR] Dispatching Urgent Bulletin Email to ${recipients.length} authorities.`);
    return true;
  }
}

class PushNotificationAdapter implements INotificationChannelAdapter {
  channel: NotificationChannel = "PUSH";
  async send(message: NotificationMessage, recipients: DispatchRecipient[]): Promise<boolean> {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(message.title, { body: message.body, icon: "/favicon.ico" });
      } catch {
        // ignore push permission exception in sandbox
      }
    }
    return true;
  }
}

export class NotificationService {
  private adapters: INotificationChannelAdapter[] = [
    new InAppNotificationAdapter(),
    new SmsNotificationAdapter(),
    new EmailNotificationAdapter(),
    new PushNotificationAdapter(),
  ];

  private defaultRecipients: DispatchRecipient[] = [
    { id: "rec-1", name: "Director S. Sharma", role: "ADMIN", phone: "+91 94361 00001", email: "admin@bhushakti.gov.in" },
    { id: "rec-2", name: "Inspector L. Sailo", role: "FIELD_OFFICER", phone: "+91 98623 55120", email: "officer.aizawl@bhushakti.gov.in" },
    { id: "rec-3", name: "BRO Highway Control Room", role: "ADMIN", phone: "+91 94361 88000", email: "bro.nh54@nic.in" },
  ];

  public async getAll(): Promise<NotificationMessage[]> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as NotificationMessage[];
        } catch {
          // ignore
        }
      }
    }

    return [
      {
        id: "notif-init-1",
        type: "CRITICAL_ALERT",
        title: "EMERGENCY: Likhuphir 29th Mile NH-10 Mudflow",
        body: "Torrential cloudburst induced severe schist slope failure on Siliguri-Gangtok highway corridor.",
        priority: "P1",
        districtName: "East Sikkim",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        channelResults: [
          { channel: "IN_APP", status: "DELIVERED", recipient: "SDMA Console" },
          { channel: "SMS", status: "SIMULATED", recipient: "SDRF Duty Officer (+91 98623...)", details: "Sandbox SMS proxy" },
        ],
      },
      {
        id: "notif-init-2",
        type: "TASK_ASSIGNED",
        title: "Task Deployed: Secure Hunthar NH-54 Roadway",
        body: "SDRF 1st Battalion allocated with earthmovers and crackmeters.",
        priority: "P1",
        districtName: "Aizawl",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        channelResults: [{ channel: "IN_APP", status: "DELIVERED", recipient: "Operator" }],
      },
    ];
  }

  public async dispatchAlert(alert: Alert): Promise<NotificationMessage> {
    const message: NotificationMessage = {
      id: `notif-${Date.now()}`,
      type: alert.severity === "CRITICAL" ? "CRITICAL_ALERT" : "HIGH_ALERT",
      title: alert.title,
      body: alert.triggerReason,
      priority: alert.responsePriority,
      districtName: alert.districtName,
      riskZoneId: alert.riskZoneId,
      actionUrl: "/response",
      createdAt: new Date().toISOString(),
      read: false,
      channelResults: [
        { channel: "IN_APP", status: "DELIVERED", recipient: "Live Dashboard & Console" },
        { channel: "SMS", status: "SIMULATED", recipient: "SDMA Duty Officer (+91 94361...)", details: "Sandbox SIMULATED Gateway" },
        { channel: "EMAIL", status: "SIMULATED", recipient: "controlroom@sdma.gov.in", details: "Sandbox SIMULATED Mailer" },
        { channel: "PUSH", status: "SIMULATED", recipient: "Mobile Field Patrol Units" },
      ],
    };

    // Execute all channel adapters in parallel
    await Promise.all(this.adapters.map((a) => a.send(message, this.defaultRecipients)));

    return message;
  }

  public async markAsRead(id: string): Promise<void> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        const list: NotificationMessage[] = JSON.parse(stored);
        const item = list.find((n) => n.id === id);
        if (item) {
          item.read = true;
          localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
        }
      }
    }
  }

  public async clearAll(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    }
  }
}

export const notificationService = new NotificationService();
