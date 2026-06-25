import { NotificationItem } from "../types";
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
