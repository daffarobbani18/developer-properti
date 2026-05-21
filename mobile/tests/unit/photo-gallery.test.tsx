import { render, waitFor, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";

import { PhotoGalleryScreen } from "../../src/screens/customer/PhotoGalleryScreen";
import { Milestone } from "../../src/types";

jest.mock("../../src/hooks/useAuth", () => ({
  useAuth: () => ({
    auth: {
      token: "mock-token",
      user: { id: "u-customer-1", fullName: "Customer", email: "customer@simdp.local", role: "CUSTOMER" },
    },
  }),
}));

jest.mock("../../src/services/api", () => ({
  getCustomerProgressData: jest.fn().mockResolvedValue([]),
}));

describe("PhotoGalleryScreen", () => {
  it("renders loading state initially", () => {
    const { getByText } = render(
      <NavigationContainer>
        <PhotoGalleryScreen />
      </NavigationContainer>
    );
    expect(getByText("Galeri Foto")).toBeTruthy();
    expect(getByText("Memuat foto progres...")).toBeTruthy();
  });

  it("renders empty state when no photos", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <PhotoGalleryScreen />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(getByText("Belum ada foto progres yang tersedia.")).toBeTruthy();
    });
  });
});