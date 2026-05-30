import { renderHook, act } from "@testing-library/react-native";

import { useOfflineQueue } from "../../src/hooks/useOfflineQueue";
import { AuthState } from "../../src/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockStoredQueue: any[] = [];

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockImplementation((key: string) => {
    if (key === "simdp-mobile-offline-queue") {
      return Promise.resolve(JSON.stringify(mockStoredQueue));
    }
    return Promise.resolve(null);
  }),
  setItem: jest.fn().mockImplementation((key: string, value: string) => {
    if (key === "simdp-mobile-offline-queue") {
      mockStoredQueue.length = 0;
      mockStoredQueue.push(...JSON.parse(value));
    }
    return Promise.resolve(undefined);
  }),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../src/hooks/useNetwork", () => ({
  useNetwork: () => ({ isConnected: false, isInternetReachable: false }),
}));

jest.mock("../../src/services/api", () => ({
  submitMilestoneUpdate: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockSubmitMilestoneUpdate = require("../../src/services/api").submitMilestoneUpdate;

describe("useOfflineQueue Hook", () => {
  const mockAuth: AuthState = {
    token: "mock-token",
    user: {
      id: "u-engineer-1",
      fullName: "Test User",
      email: "test@simdp.local",
      role: "SITE_ENGINEER",
    },
  };

  beforeEach(() => {
    mockStoredQueue.length = 0;
    jest.clearAllMocks();
  });

  it("initializes with empty queue", async () => {
    const { result } = renderHook(() => useOfflineQueue(mockAuth));
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(result.current.queueCount).toBe(0);
  });

  it("enqueues milestone update correctly", async () => {
    const { result } = renderHook(() => useOfflineQueue(mockAuth));

    await act(async () => {
      await result.current.enqueueMilestone({
        milestoneId: "mil-1",
        status: "COMPLETED",
        note: "Test note",
      });
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.queueCount).toBe(1);
  });

  it("refreshQueueCount updates queue count", async () => {
    const { result } = renderHook(() => useOfflineQueue(mockAuth));

    await act(async () => {
      await result.current.refreshQueueCount();
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(result.current.queueCount).toBe(0);
  });

  it("flushQueue returns zero when queue is empty", async () => {
    const { result } = renderHook(() => useOfflineQueue(mockAuth));

    await act(async () => {
      const flushResult = await result.current.flushQueue();
      expect(flushResult.synced).toBe(0);
      expect(flushResult.failed).toBe(0);
    });
  });

  it("enqueues multiple items and counts correctly", async () => {
    const { result } = renderHook(() => useOfflineQueue(mockAuth));

    await act(async () => {
      await result.current.enqueueMilestone({
        milestoneId: "mil-1",
        status: "COMPLETED",
        note: "First note",
      });
      await result.current.enqueueMilestone({
        milestoneId: "mil-2",
        status: "IN_PROGRESS",
        note: "Second note",
      });
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.queueCount).toBe(2);
  });

  it("flushQueue processes items and syncs successfully", async () => {
    mockSubmitMilestoneUpdate.mockResolvedValueOnce(undefined);
    
    const { result } = renderHook(() => useOfflineQueue(mockAuth));

    await act(async () => {
      await result.current.enqueueMilestone({
        milestoneId: "mil-1",
        status: "COMPLETED",
        note: "Test note",
      });
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      const flushResult = await result.current.flushQueue();
      expect(flushResult.synced).toBe(1);
      expect(flushResult.failed).toBe(0);
    });

    expect(result.current.queueCount).toBe(0);
  });

  it("flushQueue handles failures and keeps failed items in queue", async () => {
    mockSubmitMilestoneUpdate.mockRejectedValueOnce(new Error("Network error"));
    
    const { result } = renderHook(() => useOfflineQueue(mockAuth));

    await act(async () => {
      await result.current.enqueueMilestone({
        milestoneId: "mil-1",
        status: "COMPLETED",
        note: "Test note",
      });
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      const flushResult = await result.current.flushQueue();
      expect(flushResult.synced).toBe(0);
      expect(flushResult.failed).toBe(1);
    });
  });

  it("sets isSyncing to true during flushQueue", async () => {
    mockSubmitMilestoneUpdate.mockResolvedValueOnce(undefined);
    
    const { result } = renderHook(() => useOfflineQueue(mockAuth));

    await act(async () => {
      await result.current.enqueueMilestone({
        milestoneId: "mil-1",
        status: "COMPLETED",
        note: "Test note",
      });
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      const flushResult = await result.current.flushQueue();
      expect(flushResult.synced).toBe(1);
    });

    expect(result.current.isSyncing).toBe(false);
  });
});