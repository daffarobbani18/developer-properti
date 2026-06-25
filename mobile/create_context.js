const fs = require('fs');
const path = require('path');

const contextPath = path.join('src', 'contexts', 'NotificationContext.tsx');

const contextContent = `import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { NotificationItem } from "../types";
import { useAuth } from "../hooks/useAuth";
import { getRoleNotifications } from "../services/api";

type NotificationContextType = {
  notifications: NotificationItem[];
  unreadCount: number;
  criticalCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
  markAsResolvedLocally: (id: string) => void;
  markAsReadLocally: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localResolved, setLocalResolved] = useState<Set<string>>(new Set());
  const [localRead, setLocalRead] = useState<Set<string>>(new Set());

  const fetchNotifications = useCallback(async (silent = true) => {
    if (!auth || auth.user.role !== "SITE_ENGINEER") return;
    
    if (!silent) setIsLoading(true);
    try {
      const data = await getRoleNotifications(auth);
      setNotifications(data);
    } catch (e) {
      console.warn("Failed to fetch notifications", e);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [auth]);

  // Initial load & Polling setup
  useEffect(() => {
    if (!auth || auth.user.role !== "SITE_ENGINEER") return;
    
    fetchNotifications(false);
    
    // Poll every 3 minutes
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 3 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [auth, fetchNotifications]);

  const markAsResolvedLocally = useCallback((id: string) => {
    setLocalResolved(prev => new Set(prev).add(id));
  }, []);

  const markAsReadLocally = useCallback((id: string) => {
    setLocalRead(prev => new Set(prev).add(id));
  }, []);

  const augmentedNotifications = notifications.map(n => {
    // Override status based on local actions since backend doesn't support individual resolution
    if (localResolved.has(n.id)) {
      return { ...n, isRead: true, isResolved: true };
    }
    if (localRead.has(n.id)) {
      return { ...n, isRead: true };
    }
    return n;
  });

  const unreadCount = augmentedNotifications.filter(n => !n.isRead && !n.isResolved).length;
  const criticalCount = augmentedNotifications.filter(n => 
    !n.isResolved && 
    (n.title.toLowerCase().includes('deadline') || n.title.toLowerCase().includes('critical') || n.title.toLowerCase().includes('terlambat'))
  ).length;

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

fs.mkdirSync(path.join('src', 'contexts'), { recursive: true });
fs.writeFileSync(contextPath, contextContent);
console.log('NotificationContext created.');
