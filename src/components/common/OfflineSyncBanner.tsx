"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Wifi, WifiOff, RefreshCw, CheckCircle2, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { offlineQueue } from "@/lib/offline/offlineQueue";
import { useI18n } from "@/components/i18n/I18nContext";

export function OfflineSyncBanner() {
  const { t } = useI18n();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [queueCount, setQueueCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [justSynced, setJustSynced] = useState<boolean>(false);

  const updateState = useCallback(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const queue = offlineQueue.getQueue();
      setQueueCount(queue.length);
    }
  }, []);

  const handleSync = useCallback(async () => {
    if (!navigator.onLine || isSyncing) return;
    setIsSyncing(true);
    try {
      const res = await offlineQueue.syncPendingReports();
      if (res.synced > 0) {
        setJustSynced(true);
        setTimeout(() => setJustSynced(false), 4000);
      }
    } finally {
      setIsSyncing(false);
      updateState();
    }
  }, [isSyncing, updateState]);

  useEffect(() => {
    updateState();

    const handleOnline = () => {
      setIsOnline(true);
      handleSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      updateState();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    const interval = setInterval(updateState, 4000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [handleSync, updateState]);

  if (isOnline && queueCount === 0 && !justSynced) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full px-4 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
        justSynced
          ? "bg-emerald-600 text-white shadow-md"
          : !isOnline
          ? "bg-amber-600 text-white shadow-md"
          : "bg-blue-600 text-white"
      }`}
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
              <span>
                <strong>{t.offlineMode}:</strong> {queueCount > 0 ? `${queueCount} ${t.reportsWaitingSync}` : t.offlineQueueNotice}
              </span>
            </>
          ) : justSynced ? (
            <>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                <strong>{t.synced}:</strong> All offline field observations synchronized with central server.
              </span>
            </>
          ) : (
            <>
              <CloudUpload className="w-4 h-4 shrink-0" />
              <span>
                {queueCount} {t.reportsWaitingSync}
              </span>
            </>
          )}
        </div>

        {isOnline && queueCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-[11px] font-bold bg-white text-blue-900 hover:bg-white/90 border-0 shrink-0 gap-1"
            onClick={handleSync}
            disabled={isSyncing}
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? t.syncing : t.syncNow}
          </Button>
        )}
      </div>
    </div>
  );
}
