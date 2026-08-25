"use client";

import React, { useState, useEffect } from "react";
import { Bell, ShieldAlert, CheckSquare, Sparkles, Check, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notificationService } from "@/services/notificationService";
import { NotificationMessage } from "@/types/notification";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const loadNotifications = async () => {
    const list = await notificationService.getAll();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id: string) => {
    await notificationService.markAsRead(id);
    await loadNotifications();
  };

  const handleClear = async () => {
    await notificationService.clearAll();
    await loadNotifications();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="relative h-8 w-8 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Alerts and Notifications Drawer"
      >
        <Bell className="w-4 h-4 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] font-black flex items-center justify-center animate-bounce shadow-md">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden text-xs">
          {/* Header */}
          <div className="p-3 border-b flex items-center justify-between bg-muted/40">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">Disaster Alerts & Dispatch</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-rose-500"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-xs font-mono">
                No active broadcast notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 space-y-1.5 transition-colors ${
                    !notif.read ? "bg-primary/5" : "hover:bg-accent/40"
                  }`}
                  onClick={() => handleMarkRead(notif.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          notif.priority === "P1"
                            ? "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                            : "bg-orange-500/20 text-orange-700 dark:text-orange-300"
                        }`}
                      >
                        {notif.priority}
                      </span>
                      <strong className="text-foreground text-xs leading-tight">
                        {notif.title}
                      </strong>
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                    )}
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {notif.body}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono pt-1">
                    <span>{formatDate(notif.createdAt)}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ Multi-Channel Proxy Dispatched
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t bg-muted/40 text-center">
            <Link
              href="/alerts"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-primary hover:underline"
            >
              Open Full Emergency Alerts Console →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
