import { NativeModules } from "react-native";

jest.mock("@react-native-community/netinfo", () => ({
  useNetInfo: () => ({
    isConnected: true,
    isInternetReachable: true,
    type: "wifi",
  }),
}));

NativeModules.RNCNetInfo = {
  getCurrentState: jest.fn(() => Promise.resolve({
    isConnected: true,
    isInternetReachable: true,
    type: "wifi",
    details: {},
  })),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  removeListeners: jest.fn(),
};