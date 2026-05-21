import { renderHook, act } from "@testing-library/react-native";
import { useNetwork } from "../../src/hooks/useNetwork";
import NetInfo from "@react-native-community/netinfo";

jest.mock("@react-native-community/netinfo", () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(),
}));

describe("useNetwork Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with null values", () => {
    const mockUnsubscribe = jest.fn();
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb) => {
      cb({ isConnected: null, isInternetReachable: null });
      return mockUnsubscribe;
    });
    (NetInfo.fetch as jest.Mock).mockResolvedValue({
      isConnected: null,
      isInternetReachable: null,
    });

    const { result } = renderHook(() => useNetwork());

    expect(result.current.isConnected).toBeNull();
    expect(result.current.isInternetReachable).toBeNull();
  });

  it("updates state when network changes to online", async () => {
    let listenerCallback: (state: { isConnected: boolean; isInternetReachable: boolean }) => void;
    
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb) => {
      listenerCallback = cb;
      return jest.fn();
    });
    (NetInfo.fetch as jest.Mock).mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
    });

    const { result } = renderHook(() => useNetwork());

    await act(async () => {
      listenerCallback({ isConnected: true, isInternetReachable: true });
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.isInternetReachable).toBe(true);
  });

  it("updates state when network changes to offline", async () => {
    let listenerCallback: (state: { isConnected: boolean | null; isInternetReachable: boolean | null }) => void;
    
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb) => {
      listenerCallback = cb;
      return jest.fn();
    });
    (NetInfo.fetch as jest.Mock).mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
    });

    const { result } = renderHook(() => useNetwork());

    await act(async () => {
      listenerCallback({ isConnected: false, isInternetReachable: false });
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.isInternetReachable).toBe(false);
  });

  it("cleans up subscription on unmount", () => {
    const mockUnsubscribe = jest.fn();
    (NetInfo.addEventListener as jest.Mock).mockImplementation(() => mockUnsubscribe);
    (NetInfo.fetch as jest.Mock).mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
    });

    const { unmount } = renderHook(() => useNetwork());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});