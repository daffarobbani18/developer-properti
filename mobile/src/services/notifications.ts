import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

import { AuthState } from "../types";
import { registerPushToken } from "./api";

type PushRegistrationResult = {
  token: string | null;
  enabled: boolean;
  message?: string;
};

type PushBootstrap = {
  registration: PushRegistrationResult;
  cleanup: () => void;
};

type PushPayload = Record<string, unknown>;

export type MobilePushRouteName =
  | "Beranda"
  | "Milestone"
  | "Unit"
  | "Kendala"
  | "Notifikasi"
  | "Progres"
  | "Tagihan"
  | "Dokumen"
  | "Bantuan";

export type PushResponsePayload = {
  routeName: MobilePushRouteName | null;
  type: string | null;
  entityId: string | null;
  rawPayload: PushPayload;
};

const ROUTE_ALIAS_MAP: Record<string, MobilePushRouteName> = {
  beranda: "Beranda",
  home: "Beranda",
  milestone: "Milestone",
  milestones: "Milestone",
  unit: "Unit",
  units: "Unit",
  issue: "Kendala",
  issues: "Kendala",
  kendala: "Kendala",
  notification: "Notifikasi",
  notifications: "Notifikasi",
  notifikasi: "Notifikasi",
  progress: "Progres",
  progres: "Progres",
  billing: "Tagihan",
  invoice: "Tagihan",
  tagihan: "Tagihan",
  document: "Dokumen",
  documents: "Dokumen",
  dokumen: "Dokumen",
  support: "Bantuan",
  ticket: "Bantuan",
  bantuan: "Bantuan",
};

let isConfigured = false;

function configureNotificationBehavior(): void {
  if (isConfigured) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  isConfigured = true;
}

function isPhysicalDevice(): boolean {
  // expo-constants always exists in this app. Device check differs by platform and runtime.
  return Constants.isDevice === true;
}

function resolvePlatformForApi(): "android" | "ios" | "web" {
  if (Platform.OS === "android" || Platform.OS === "ios" || Platform.OS === "web") {
    return Platform.OS;
  }

  return "web";
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#1e6f78",
  });
}

async function getProjectId(): Promise<string | null> {
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    null;

  return projectId;
}

function normalizeRouteName(value: unknown): MobilePushRouteName | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return ROUTE_ALIAS_MAP[normalized] ?? null;
}

function inferRouteFromType(type: string): MobilePushRouteName | null {
  const normalizedType = type.trim().toLowerCase();

  if (normalizedType.includes("milestone")) {
    return "Milestone";
  }
  if (normalizedType.includes("issue") || normalizedType.includes("kendala")) {
    return "Kendala";
  }
  if (normalizedType.includes("notif")) {
    return "Notifikasi";
  }
  if (normalizedType.includes("progress") || normalizedType.includes("progres")) {
    return "Progres";
  }
  if (
    normalizedType.includes("billing") ||
    normalizedType.includes("invoice") ||
    normalizedType.includes("payment") ||
    normalizedType.includes("tagihan")
  ) {
    return "Tagihan";
  }
  if (normalizedType.includes("document") || normalizedType.includes("dokumen")) {
    return "Dokumen";
  }
  if (
    normalizedType.includes("support") ||
    normalizedType.includes("ticket") ||
    normalizedType.includes("bantuan")
  ) {
    return "Bantuan";
  }

  return null;
}

export function parsePushResponsePayload(payload: PushPayload): PushResponsePayload {
  const type = typeof payload.type === "string" ? payload.type : null;

  const routeFromPayload =
    normalizeRouteName(payload.route) ??
    normalizeRouteName(payload.screen) ??
    normalizeRouteName(payload.tab);

  const inferredRoute = type ? inferRouteFromType(type) : null;
  const routeName = routeFromPayload ?? inferredRoute;

  const entityId =
    typeof payload.entityId === "string"
      ? payload.entityId
      : typeof payload.id === "string"
        ? payload.id
        : null;

  return {
    routeName,
    type,
    entityId,
    rawPayload: payload,
  };
}

export async function registerDeviceForPush(
  auth: AuthState | null
): Promise<PushRegistrationResult> {
  configureNotificationBehavior();

  if (!isPhysicalDevice()) {
    return {
      token: null,
      enabled: false,
      message: "Push notification hanya aktif di perangkat fisik.",
    };
  }

  const permissionState = await Notifications.getPermissionsAsync();
  let finalStatus = permissionState.status;

  if (finalStatus !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    finalStatus = requested.status;
  }

  if (finalStatus !== "granted") {
    return {
      token: null,
      enabled: false,
      message: "Izin notifikasi ditolak pengguna.",
    };
  }

  await ensureAndroidChannel();

  const projectId = await getProjectId();
  if (!projectId) {
    return {
      token: null,
      enabled: false,
      message: "Project ID Expo belum dikonfigurasi untuk push token.",
    };
  }

  const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
  const token = tokenResponse.data;

  if (auth) {
    await registerPushToken(auth, {
      expoPushToken: token,
      platform: resolvePlatformForApi(),
      appVersion: Constants.expoConfig?.version,
    });
  }

  return {
    token,
    enabled: true,
  };
}

export async function bootstrapPushNotifications(
  auth: AuthState | null,
  onIncoming?: (title: string, body: string) => void,
  onResponse?: (payload: PushResponsePayload) => void
): Promise<PushBootstrap> {
  const registration = await registerDeviceForPush(auth);

  const foregroundSubscription = Notifications.addNotificationReceivedListener((notification) => {
    const title = notification.request.content.title ?? "Notifikasi Baru";
    const body = notification.request.content.body ?? "Anda menerima pembaruan terbaru.";

    if (onIncoming) {
      onIncoming(title, body);
    }
  });

  const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const rawPayload = response.notification.request.content.data;
    const payload =
      rawPayload && typeof rawPayload === "object"
        ? (rawPayload as PushPayload)
        : {};

    const parsedPayload = parsePushResponsePayload(payload);

    if (onResponse) {
      onResponse(parsedPayload);
    }
  });

  return {
    registration,
    cleanup: () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    },
  };
}
