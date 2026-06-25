import { useCallback, useEffect, useState } from "react";
import { submitMilestoneUpdate, submitDailyReport, updateDefectStatus } from "../services/api";
import { uploadPhoto } from "../services/media";
import { getOfflineQueue, pushOfflineQueue, setOfflineQueue } from "../services/storage";
import { AuthState, PendingQueueItem } from "../types";
import { useNetwork } from "./useNetwork";

const queueItemTemplate = (type: PendingQueueItem["type"], payload: any): PendingQueueItem => ({
  id: "queue-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9),
  type,
  payload,
  createdAt: new Date().toISOString(),
});

export function useOfflineQueue(auth: AuthState | null): {
  queueCount: number;
  refreshQueueCount: () => Promise<void>;
  enqueueAction: (type: PendingQueueItem["type"], payload: any) => Promise<void>;
  flushQueue: (authParam?: AuthState | null) => Promise<{ synced: number; failed: number }>;
  isSyncing: boolean;
} {
  const [queueCount, setQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isConnected } = useNetwork();

  const refreshQueueCount = useCallback(async () => {
    const queue = await getOfflineQueue();
    setQueueCount(queue.length);
  }, []);

  useEffect(() => {
    refreshQueueCount();
  }, [refreshQueueCount]);

  const enqueueAction = useCallback(
    async (type: PendingQueueItem["type"], payload: any) => {
      const item = queueItemTemplate(type, payload);
      await pushOfflineQueue(item);
      await refreshQueueCount();
    },
    [refreshQueueCount]
  );

  const flushQueue = useCallback(
    async (authParam?: AuthState | null) => {
      const session = authParam ?? auth;
      const queue = await getOfflineQueue();
      if (queue.length === 0 || !session) {
        return { synced: 0, failed: 0 };
      }

      setIsSyncing(true);
      const remaining: PendingQueueItem[] = [];
      let synced = 0;

      for (const item of queue) {
        try {
          if (item.type === "MILESTONE_UPDATE") {
            await submitMilestoneUpdate(session, item.payload);
          } else if (item.type === "DAILY_REPORT") {
            await submitDailyReport(session, item.payload);
          } else if (item.type === "DEFECT_UPDATE") {
            await updateDefectStatus(session, item.payload.defectId, item.payload.status);
          } else if (item.type === "PHOTO_UPLOAD") {
            await uploadPhoto(item.payload.uri, session);
          }
          synced += 1;
        } catch {
          remaining.push(item);
        }
      }

      await setOfflineQueue(remaining);
      await refreshQueueCount();
      setIsSyncing(false);

      return {
        synced,
        failed: remaining.length,
      };
    },
    [auth, refreshQueueCount]
  );

  useEffect(() => {
    if (isConnected && queueCount > 0 && auth) {
      void flushQueue(auth);
    }
  }, [isConnected, queueCount, flushQueue, auth]);

  return {
    queueCount,
    refreshQueueCount,
    enqueueAction,
    flushQueue,
    isSyncing,
  };
}
