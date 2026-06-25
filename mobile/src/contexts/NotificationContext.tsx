import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationItem } from "../types";
import { useAuth } from "../hooks/useAuth";
import { notificationService } from "../services/notificationService";
import { mapRawNotificationToUI, getPriorityScore } from "../utils/notificationMapper";

type NotificationContextType = {
  notifications: NotificationItem[];
  unreadCount: number;
  criticalCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
  markAsResolvedLocally: (id: string) => Promise<void>;
  markAsReadLocally: (id: string) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const getCacheKey = (role: string, userId: string, type: 'read' | 'resolved') => {
  return `@simdp:${role}:${userId}:local_${type}_notifs`;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localResolved, setLocalResolved] = useState<Set<string>>(new Set());
  const [localRead, setLocalRead] = useState<Set<string>>(new Set());

  // Load from AsyncStorage when auth changes
  useEffect(() => {
    if (!auth) {
      setLocalRead(new Set());
      setLocalResolved(new Set());
      setNotifications([]);
      return;
    }

    const readKey = getCacheKey(auth.user.role, auth.user.id, 'read');
    const resKey = getCacheKey(auth.user.role, auth.user.id, 'resolved');

    const loadCache = async () => {
      try {
        const [readCache, resCache] = await Promise.all([
          AsyncStorage.getItem(readKey),
          AsyncStorage.getItem(resKey)
        ]);
        if (readCache) setLocalRead(new Set(JSON.parse(readCache)));
        else setLocalRead(new Set());

        if (resCache) setLocalResolved(new Set(JSON.parse(resCache)));
        else setLocalResolved(new Set());
      } catch (e) {
        console.warn("Failed to load notification cache");
      }
    };
    loadCache();
  }, [auth]);

  const fetchNotifications = useCallback(async (silent = true) => {
    if (!auth) return;
    
    if (!silent) setIsLoading(true);
    try {
      const data = await notificationService.getNotifications(auth);
      setNotifications(data);
    } catch (e) {
      console.warn("Failed to fetch notifications gracefully in background", e);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [auth]);

  // Polling setup
  useEffect(() => {
    if (!auth) return;
    
    fetchNotifications(false);
    
    if (auth.user.role === "SITE_ENGINEER") {
      const interval = setInterval(() => {
        fetchNotifications(true);
      }, 3 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [auth, fetchNotifications]);

  const markAsResolvedLocally = useCallback(async (id: string) => {
    if (!auth) return;
    
    setLocalResolved(prev => {
      const next = new Set(prev).add(id);
      const resKey = getCacheKey(auth.user.role, auth.user.id, 'resolved');
      AsyncStorage.setItem(resKey, JSON.stringify(Array.from(next))).catch(() => {});
      return next;
    });
    
    // Fire to backend (currently mock service)
    await notificationService.resolve(auth, id).catch(() => {});
  }, [auth]);

  const markAsReadLocally = useCallback(async (id: string) => {
    if (!auth) return;
    
    setLocalRead(prev => {
      const next = new Set(prev).add(id);
      const readKey = getCacheKey(auth.user.role, auth.user.id, 'read');
      AsyncStorage.setItem(readKey, JSON.stringify(Array.from(next))).catch(() => {});
      return next;
    });
    
    // Fire to backend
    await notificationService.markAsRead(auth, id).catch(() => {});
  }, [auth]);

  const augmentedNotifications = notifications
    .map(n => mapRawNotificationToUI(n, localRead, localResolved))
    .sort((a, b) => {
      const scoreA = getPriorityScore(a.severity!);
      const scoreB = getPriorityScore(b.severity!);
      if (scoreA !== scoreB) return scoreB - scoreA;
      
      if (a.isResolved !== b.isResolved) return a.isResolved ? 1 : -1;
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const unreadCount = augmentedNotifications.filter(n => !n.isRead && !n.isResolved).length;
  const criticalCount = augmentedNotifications.filter(n => !n.isResolved && n.severity === "critical").length;

  return (
    <NotificationContext.Provider
      value={{
        notifications: augmentedNotifications,
        unreadCount,
        criticalCount,
        isLoading,
        refresh: () => fetchNotifications(false),
        markAsResolvedLocally,
        markAsReadLocally
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
