const fs = require('fs');
const path = require('path');

// 1. notificationMapper.ts
const mapperPath = path.join('src', 'utils', 'notificationMapper.ts');
const mapperContent = `import { NotificationItem } from "../types";

export function inferSeverity(n: NotificationItem): "critical" | "warning" | "info" {
  if (n.severity) return n.severity;
  const title = n.title.toLowerCase();
  const type = (n.type || "") as string;
  if (title.includes('deadline') || title.includes('critical') || title.includes('terlambat') || title.includes('kekurangan') || type === 'deadline_alert') {
    return "critical";
  }
  if (title.includes('defect') || title.includes('perhatian') || type === 'defect_alert') {
    return "warning";
  }
  return "info";
}

export function inferActionType(n: NotificationItem): string | undefined {
  if (n.actionType) return n.actionType;
  if (n.data?.route) return n.data.route;
  return n.type;
}

export function getPriorityScore(severity: "critical" | "warning" | "info"): number {
  if (severity === "critical") return 3;
  if (severity === "warning") return 2;
  return 1;
}

export function mapRawNotificationToUI(n: NotificationItem, localRead: Set<string>, localResolved: Set<string>): NotificationItem {
  let isRead = n.isRead;
  let isResolved = n.isResolved;
  
  if (localResolved.has(n.id)) {
    isRead = true;
    isResolved = true;
  } else if (localRead.has(n.id)) {
    isRead = true;
  }
  
  return {
    ...n,
    isRead,
    isResolved,
    severity: inferSeverity(n),
    actionType: inferActionType(n)
  };
}
`;
fs.writeFileSync(mapperPath, mapperContent);

// 2. notificationService.ts
const servicePath = path.join('src', 'services', 'notificationService.ts');
const serviceContent = `import { NotificationItem } from "../types";
import { AuthState } from "../types";
import { getRoleNotifications } from "./api";

// Future-Proof Backend API Interface
export interface INotificationService {
  getNotifications(auth: AuthState): Promise<NotificationItem[]>;
  markAsRead(auth: AuthState, id: string): Promise<void>;
  resolve(auth: AuthState, id: string): Promise<void>;
}

// Current Implementation (Mock Fallback)
export const MockNotificationService: INotificationService = {
  getNotifications: async (auth: AuthState) => {
    // Falls back to api.ts -> getRoleNotifications which handles the mock data switch internally
    return getRoleNotifications(auth);
  },
  markAsRead: async (auth: AuthState, id: string) => {
    // API not available yet, simulated local success
    return Promise.resolve();
  },
  resolve: async (auth: AuthState, id: string) => {
    // API not available yet, simulated local success
    return Promise.resolve();
  }
};

// Singleton export
export const notificationService = MockNotificationService;
`;
fs.writeFileSync(servicePath, serviceContent);

// 3. Rewrite NotificationContext.tsx
const contextPath = path.join('src', 'contexts', 'NotificationContext.tsx');
const contextContent = `import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
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

const LOCAL_READ_KEY = "@simdp:local_read_notifs";
const LOCAL_RESOLVED_KEY = "@simdp:local_resolved_notifs";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localResolved, setLocalResolved] = useState<Set<string>>(new Set());
  const [localRead, setLocalRead] = useState<Set<string>>(new Set());

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadCache = async () => {
      try {
        const [readCache, resCache] = await Promise.all([
          AsyncStorage.getItem(LOCAL_READ_KEY),
          AsyncStorage.getItem(LOCAL_RESOLVED_KEY)
        ]);
        if (readCache) setLocalRead(new Set(JSON.parse(readCache)));
        if (resCache) setLocalResolved(new Set(JSON.parse(resCache)));
      } catch (e) {
        console.warn("Failed to load notification cache");
      }
    };
    loadCache();
  }, []);

  const fetchNotifications = useCallback(async (silent = true) => {
    if (!auth || auth.user.role !== "SITE_ENGINEER") return;
    
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
    if (!auth || auth.user.role !== "SITE_ENGINEER") return;
    
    fetchNotifications(false);
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 3 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [auth, fetchNotifications]);

  const markAsResolvedLocally = useCallback(async (id: string) => {
    if (!auth) return;
    
    setLocalResolved(prev => {
      const next = new Set(prev).add(id);
      AsyncStorage.setItem(LOCAL_RESOLVED_KEY, JSON.stringify(Array.from(next))).catch(() => {});
      return next;
    });
    
    // Fire to backend (currently mock service)
    await notificationService.resolve(auth, id).catch(() => {});
  }, [auth]);

  const markAsReadLocally = useCallback(async (id: string) => {
    if (!auth) return;
    
    setLocalRead(prev => {
      const next = new Set(prev).add(id);
      AsyncStorage.setItem(LOCAL_READ_KEY, JSON.stringify(Array.from(next))).catch(() => {});
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
`;
fs.writeFileSync(contextPath, contextContent);

console.log('Refactoring complete.');
