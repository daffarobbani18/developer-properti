import { useCallback, useEffect, useState } from "react";

import { submitMilestoneUpdate } from "../services/api";
import { queueItemTemplate } from "../services/mock-data";
import { getOfflineQueue, pushOfflineQueue, setOfflineQueue } from "../services/storage";
import { AuthState, PendingQueueItem } from "../types";
import { useNetwork } from "./useNetwork";

export function useOfflineQueue(auth: AuthState | null): {
   queueCount: number;
   refreshQueueCount: () => Promise<void>;
   enqueueMilestone: (payload: PendingQueueItem["payload"]) => Promise<void>;
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

  const enqueueMilestone = useCallback(
    async (payload: PendingQueueItem["payload"]) => {
      const item = queueItemTemplate(payload);
      await pushOfflineQueue(item);
      await refreshQueueCount();
    },
    [refreshQueueCount]
  );

  const flushQueue = useCallback(
    async (authParam?: AuthState | null) => {
      const session = authParam ?? auth;
      const queue = await getOfflineQueue();
      if (queue.length === 0) {
        return { synced: 0, failed: 0 };
      }

      setIsSyncing(true);
      const remaining: PendingQueueItem[] = [];
      let synced = 0;

      for (const item of queue) {
        try {
          if (item.type === "MILESTONE_UPDATE") {
            await submitMilestoneUpdate(session, item.payload);
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
    enqueueMilestone,
    flushQueue,
    isSyncing,
  };
}
