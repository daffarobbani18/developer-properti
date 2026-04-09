import { useCallback, useEffect, useState } from "react";

import { submitMilestoneUpdate } from "../services/api";
import { queueItemTemplate } from "../services/mock-data";
import { getOfflineQueue, pushOfflineQueue, setOfflineQueue } from "../services/storage";
import { AuthState, PendingQueueItem } from "../types";

export function useOfflineQueue(): {
  queueCount: number;
  refreshQueueCount: () => Promise<void>;
  enqueueMilestone: (payload: PendingQueueItem["payload"]) => Promise<void>;
  flushQueue: (auth: AuthState | null) => Promise<{ synced: number; failed: number }>;
} {
  const [queueCount, setQueueCount] = useState(0);

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
    async (auth: AuthState | null) => {
      const queue = await getOfflineQueue();
      if (queue.length === 0) {
        return { synced: 0, failed: 0 };
      }

      const remaining: PendingQueueItem[] = [];
      let synced = 0;

      for (const item of queue) {
        try {
          if (item.type === "MILESTONE_UPDATE") {
            await submitMilestoneUpdate(auth, item.payload);
          }
          synced += 1;
        } catch {
          remaining.push(item);
        }
      }

      await setOfflineQueue(remaining);
      await refreshQueueCount();

      return {
        synced,
        failed: remaining.length,
      };
    },
    [refreshQueueCount]
  );

  return {
    queueCount,
    refreshQueueCount,
    enqueueMilestone,
    flushQueue,
  };
}
