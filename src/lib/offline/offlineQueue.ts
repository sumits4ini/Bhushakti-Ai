import { FieldReport, SyncStatus } from "@/types/fieldReport";
import { reportRepository } from "@/services/reportRepository";

const OFFLINE_REPORTS_QUEUE_KEY = "bhushakti_offline_reports_queue";
const DRAFT_REPORT_KEY = "bhushakti_draft_field_report";

export interface OfflineQueueItem {
  id: string;
  reportData: Parameters<typeof reportRepository.create>[0];
  queuedAt: string;
  syncStatus: SyncStatus;
  retryCount: number;
}

export const offlineQueue = {
  /**
   * Check if the browser currently has internet connectivity
   */
  isOnline(): boolean {
    if (typeof window === "undefined") return true;
    return navigator.onLine;
  },

  /**
   * Get all queued offline reports
   */
  getQueue(): OfflineQueueItem[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(OFFLINE_REPORTS_QUEUE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as OfflineQueueItem[];
    } catch {
      return [];
    }
  },

  /**
   * Enqueue a report for offline synchronization
   */
  enqueue(reportData: Parameters<typeof reportRepository.create>[0]): OfflineQueueItem {
    const item: OfflineQueueItem = {
      id: `queue-${Date.now()}`,
      reportData,
      queuedAt: new Date().toISOString(),
      syncStatus: "PENDING_SYNC",
      retryCount: 0,
    };

    if (typeof window !== "undefined") {
      const list = this.getQueue();
      list.push(item);
      localStorage.setItem(OFFLINE_REPORTS_QUEUE_KEY, JSON.stringify(list));
    }

    return item;
  },

  /**
   * Save a work-in-progress draft report
   */
  saveDraft(draft: Record<string, unknown>): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(DRAFT_REPORT_KEY, JSON.stringify(draft));
    }
  },

  /**
   * Retrieve saved draft
   */
  getDraft<T>(): T | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(DRAFT_REPORT_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as T;
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  /**
   * Clear draft
   */
  clearDraft(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(DRAFT_REPORT_KEY);
    }
  },

  /**
   * Automatically process and sync all queued reports when connection is restored
   */
  async syncPendingReports(
    onProgress?: (syncedCount: number, totalCount: number) => void
  ): Promise<{ synced: number; failed: number }> {
    const queue = this.getQueue();
    if (queue.length === 0) return { synced: 0, failed: 0 };

    let synced = 0;
    let failed = 0;
    const remaining: OfflineQueueItem[] = [];

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      try {
        await reportRepository.create(item.reportData);
        synced++;
        if (onProgress) onProgress(synced, queue.length);
      } catch (err) {
        console.warn(`Failed to sync queued report ${item.id}:`, err);
        item.retryCount++;
        item.syncStatus = "FAILED";
        remaining.push(item);
        failed++;
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(OFFLINE_REPORTS_QUEUE_KEY, JSON.stringify(remaining));
    }

    return { synced, failed };
  },
};
