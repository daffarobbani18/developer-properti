import { DeviceEventEmitter } from "react-native";
import { AuthState, BillingSummary, CustomerOverview, DailyReport, DocumentItem, FaqItem, HandoverInfo, InvoiceItem, Milestone, NotificationItem, PaymentItem, ProjectSummary, TicketItem, Unit } from "../types";
import { authenticateMock, createTicket, getBillingData, getCustomerOverview, getCustomerProgress, getDocuments, getMilestones, getNotifications, getProjectSummaries, getSupportData, getUnits, markNotificationsRead, mockHandoverInfo, replyToTicket as mockReplyToTicket, updateMilestone, uploadPaymentProof, markTicketAsRead as mockMarkTicketAsRead } from "./mock-data";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
const REQUEST_TIMEOUT_MS = 10000;
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("API timeout"));
    }, timeoutMs);
    promise.then(result => {
      clearTimeout(timeoutId);
      resolve(result);
    }).catch(error => {
      clearTimeout(timeoutId);
      reject(error);
    });
  });
}
function buildHeaders(token?: string, headers?: HeadersInit): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? {
      Authorization: `Bearer ${token}`
    } : {}),
    ...(headers ?? {})
  };
}
async function requestJson<T>(path: string, options?: RequestInit & {
  token?: string;
}): Promise<T> {
  const response = await withTimeout(fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options?.token, options?.headers)
  }), REQUEST_TIMEOUT_MS);
  if (response.status === 401) {
    DeviceEventEmitter.emit("onUnauthorized");
  }
  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(errText || `API error ${response.status}`);
  }
  const text = await response.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}
function unwrapData<T>(input: T | {
  data: T;
}): T {
  if (typeof input === "object" && input !== null && "data" in input) {
    return (input as {
      data: T;
    }).data;
  }
  return input as T;
}

export function normalizeTicketStatus(status: string): TicketItem["status"] {
  if (status === "SEDANG_DITANGANI") return "DIPROSES";
  if (status === "BARU" || status === "DIPROSES" || status === "MENUNGGU_TINDAKAN_CUSTOMER" || status === "SELESAI" || status === "DITUTUP") {
    return status as TicketItem["status"];
  }
  return "DIPROSES"; // fallback
}

export function normalizeTickets(tickets: TicketItem[]): TicketItem[] {
  if (!tickets) return [];
  return tickets.map(t => ({
    ...t,
    status: normalizeTicketStatus(t.status as string)
  }));
}

function normalizeAuthResponse(payload: unknown): AuthState | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const candidate = "data" in payload ? (payload as {
    data: unknown;
  }).data : payload;
  if (!candidate || typeof candidate !== "object") {
    return null;
  }
  if (!("token" in candidate) || !("user" in candidate)) {
    return null;
  }
  const token = (candidate as {
    token?: unknown;
  }).token;
  const user = (candidate as {
    user?: unknown;
  }).user;
  if (typeof token !== "string" || !user || typeof user !== "object" || !("id" in user) || !("id" in user) || !("email" in user) || !("role" in user)) {
    return null;
  }
  let roleStr = String((user as {
    role: unknown;
  }).role);
  let finalRole: AuthState["user"]["role"] = "CUSTOMER"; // fallback

  if (roleStr === "Pengawas Lapangan" || roleStr === "SITE_ENGINEER") {
    finalRole = "SITE_ENGINEER";
  } else if (roleStr === "Customer" || roleStr === "CUSTOMER") {
    finalRole = "CUSTOMER";
  }
  return {
    token,
    user: {
      id: String((user as {
        id: unknown;
      }).id),
      fullName: String((user as {
        fullName?: unknown;
      }).fullName || (user as {
        email: unknown;
      }).email),
      email: String((user as {
        email: unknown;
      }).email),
      role: finalRole
    }
  };
}
function ensureAuth(auth: AuthState | null): AuthState {
  if (!auth) {
    throw new Error("Sesi tidak ditemukan, silakan login ulang.");
  }
  return auth;
}
export async function login(email: string, password: string): Promise<AuthState> {
  try {
    const response = await requestJson<unknown>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      })
    });
    const normalized = normalizeAuthResponse(response);
    if (normalized) {
      return normalized;
    }
  } catch {

    // Fall back to local mock credentials when API is unavailable.
  }
  const auth = authenticateMock(email, password);
  if (!auth) {
    throw new Error("Email atau password tidak valid.");
  }
  return auth;
}
export async function getFieldProjects(auth: AuthState | null): Promise<ProjectSummary[]> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<ProjectSummary[] | {
      data: ProjectSummary[];
    }>("/mobile/field/projects", {
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return getProjectSummaries();
  }
}
export async function getProjectOptions(auth: AuthState | null): Promise<ProjectSummary[]> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<ProjectSummary[] | {
      data: ProjectSummary[];
    }>("/mobile/field/project-options", {
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return getProjectSummaries();
  }
}
export async function getProjectDetail(auth: AuthState | null, projectId: string): Promise<any> {
  const session = ensureAuth(auth);
  const response = await requestJson<any>(`/mobile/field/projects/${projectId}`, {
    token: session.token
  });
  return unwrapData(response);
}
export async function getFieldUnits(auth: AuthState | null, params?: {
  projectId?: string;
  search?: string;
}): Promise<Unit[]> {
  const session = ensureAuth(auth);
  try {
    const query = new URLSearchParams();
    if (params?.projectId) {
      query.set("projectId", params.projectId);
    }
    if (params?.search) {
      query.set("search", params.search);
    }
    const path = `/mobile/field/units${query.toString() ? `?${query.toString()}` : ""}`;
    const response = await requestJson<Unit[] | {
      data: Unit[];
    }>(path, {
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return getUnits(params?.projectId, params?.search);
  }
}
export async function createInspectionDefect(auth: AuthState | null, bookingId: string, description: string, imageUri?: string | null): Promise<any> {
  const session = ensureAuth(auth);
  try {
    const formData = new FormData();
    formData.append("bookingId", bookingId);
    formData.append("description", description);

    if (imageUri) {
      const filename = imageUri.split('/').pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append("file", { uri: imageUri, name: filename, type } as any);
    }

    const response = await fetch(`${API_BASE_URL}/api/legal/defects`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.token}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    return response.json();
  } catch {
    const newDefect = {
      id: `d-${Date.now()}`,
      bookingId,
      description,
      status: "DILAPORKAN",
      photoUrl: imageUri || "https://via.placeholder.com/300",
      createdAt: new Date().toISOString()
    };
    mockDefects.push(newDefect);
    return { data: newDefect };
  }
}
export async function getUnitMilestones(auth: AuthState | null, unitId: string): Promise<Milestone[]> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<Milestone[] | {
      data: Milestone[];
    }>(`/mobile/field/units/${unitId}/milestones`, {
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return getMilestones(unitId);
  }
}

export async function uploadImage(auth: AuthState | null, uri: string): Promise<string> {
  const session = ensureAuth(auth);
  
  if (!uri.startsWith("file://") && !uri.startsWith("blob:")) {
    return uri; // Already a remote URL
  }

  const formData = new FormData();
  const filename = uri.split('/').pop() || "photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image/jpeg`;
  
  formData.append("image", { uri, name: filename, type } as any);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${session.token}`,
      // Do not set Content-Type, fetch will set it with the boundary automatically
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();
  return `${API_BASE_URL}${data.imageUrl}`;
}

export async function submitMilestoneUpdate(auth: AuthState | null, payload: {
  milestoneId: string;
  status: Milestone["status"];
  note?: string;
  photoUrl?: string;
  photoUrls?: string[];
}): Promise<Milestone> {
  const session = ensureAuth(auth);
  
  // Upload any local photos first
  let finalPhotoUrls: string[] = [];
  if (payload.photoUrls && payload.photoUrls.length > 0) {
    finalPhotoUrls = await Promise.all(
      payload.photoUrls.map(uri => uploadImage(auth, uri))
    );
  }
  let finalPhotoUrl = payload.photoUrl;
  if (finalPhotoUrl) {
    finalPhotoUrl = await uploadImage(auth, finalPhotoUrl);
  }

  const finalPayload = {
    ...payload,
    photoUrl: finalPhotoUrl,
    photoUrls: finalPhotoUrls.length > 0 ? finalPhotoUrls : undefined
  };

  try {
    const response = await requestJson<Milestone | {
      data: Milestone;
    }>(`/mobile/field/milestones/${payload.milestoneId}`, {
      method: "PATCH",
      token: session.token,
      body: JSON.stringify(finalPayload)
    });
    return unwrapData(response);
  } catch {
    return updateMilestone(payload);
  }
}
export async function getRoleNotifications(auth: AuthState | null): Promise<NotificationItem[]> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<NotificationItem[] | {
      data: NotificationItem[];
    }>("/mobile/notifications", {
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return getNotifications(session.user.role);
  }
}
export async function markNotificationsAsRead(auth: AuthState | null): Promise<NotificationItem[]> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<NotificationItem[] | {
      data: NotificationItem[];
    }>("/mobile/notifications/mark-read", {
      method: "POST",
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return markNotificationsRead(session.user.role);
  }
}
export async function registerPushToken(auth: AuthState | null, payload: {
  expoPushToken: string;
  platform: "android" | "ios" | "web";
  appVersion?: string;
}): Promise<void> {
  const session = ensureAuth(auth);
  try {
    await requestJson<{
      success: boolean;
    } | {
      data: {
        success: boolean;
      };
    }>("/mobile/notifications/push-token", {
      method: "POST",
      token: session.token,
      body: JSON.stringify(payload)
    });
  } catch {

    // The upstream API may not expose push token registration yet.
    // Keep this silent so local/mock workflow continues to work.
  }
}
export async function registerBiometricCredential(auth: AuthState | null, payload: {
  credentialId: string;
  publicKey: string;
}): Promise<void> {
  const session = ensureAuth(auth);
  try {
    await requestJson<{
      success: boolean;
    } | {
      data: {
        success: boolean;
      };
    }>("/mobile/auth/biometric-credential", {
      method: "POST",
      token: session.token,
      body: JSON.stringify(payload)
    });
  } catch {

    // API may not support biometric registration yet
  }
}
export async function getCustomerOverviewData(auth: AuthState | null): Promise<CustomerOverview> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<CustomerOverview | {
      data: CustomerOverview;
    }>("/mobile/customer/overview", {
      token: session.token
    });
    const data = unwrapData(response);
    if (data.activeTickets) {
      data.activeTickets = normalizeTickets(data.activeTickets);
    }
    return data;
  } catch {
    const data = getCustomerOverview();
    if (data.activeTickets) {
      data.activeTickets = normalizeTickets(data.activeTickets);
    }
    return data;
  }
}
export async function getCustomerUnitsData(auth: AuthState | null): Promise<Unit[]> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<Unit[] | {
      data: Unit[];
    }>("/mobile/customer/units", {
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return []; // mock or empty array
  }
}

export async function getCustomerProgressData(auth: AuthState | null, unitId?: string): Promise<Milestone[]> {
  const session = ensureAuth(auth);
  try {
    let url = "/mobile/customer/progress";
    if (unitId) {
      url += `?unitId=${encodeURIComponent(unitId)}`;
    }
    const response = await requestJson<Milestone[] | {
      data: Milestone[];
    }>(url, {
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return getCustomerProgress();
  }
}
export async function getCustomerBillingData(auth: AuthState | null): Promise<{
  summary: BillingSummary;
  invoices: InvoiceItem[];
  payments: PaymentItem[];
}> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<{
      summary: BillingSummary;
      invoices: InvoiceItem[];
      payments: PaymentItem[];
    } | {
      data: {
        summary: BillingSummary;
        invoices: InvoiceItem[];
        payments: PaymentItem[];
      };
    }>("/mobile/customer/billing", {
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return getBillingData();
  }
}
export async function submitPaymentProof(auth: AuthState | null, payload: {
  invoiceId: string;
  amount: number;
  proofUrl: string;
}): Promise<PaymentItem> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<PaymentItem | {
      data: PaymentItem;
    }>("/mobile/customer/payments", {
      method: "POST",
      token: session.token,
      body: JSON.stringify(payload)
    });
    return unwrapData(response);
  } catch {
    return uploadPaymentProof(payload);
  }
}
export async function getCustomerDocuments(auth: AuthState | null): Promise<DocumentItem[]> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<DocumentItem[] | {
      data: DocumentItem[];
    }>("/mobile/customer/documents", {
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return getDocuments();
  }
}
export async function getCustomerSupportData(auth: AuthState | null): Promise<{
  tickets: TicketItem[];
  faq: FaqItem[];
}> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<{
      tickets: TicketItem[];
      faq: FaqItem[];
    } | {
      data: {
        tickets: TicketItem[];
        faq: FaqItem[];
      };
    }>("/mobile/customer/support", {
      token: session.token
    });
    const data = unwrapData(response);
    data.tickets = normalizeTickets(data.tickets);
    return data;
  } catch {
    const data = getSupportData();
    data.tickets = normalizeTickets(data.tickets);
    return data;
  }
}
export async function createCustomerTicket(auth: AuthState | null, payload: {
  category: TicketItem["category"];
  subject: string;
  description: string;
  photoUrls?: string[];
}): Promise<TicketItem> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<TicketItem | {
      data: TicketItem;
    }>("/mobile/customer/support/tickets", {
      method: "POST",
      token: session.token,
      body: JSON.stringify(payload)
    });
    const data = unwrapData(response);
    data.status = normalizeTicketStatus(data.status as string);
    return data;
  } catch {
    const data = createTicket(payload);
    data.status = normalizeTicketStatus(data.status as string);
    return data;
  }
}

export async function markTicketAsRead(auth: AuthState | null, ticketId: string): Promise<void> {
  const session = ensureAuth(auth);
  try {
     await requestJson(`/mobile/customer/tickets/${ticketId}/read`, {
       method: "POST",
       token: session.token
     });
  } catch {
     mockMarkTicketAsRead(ticketId);
  }
}
export async function replyToTicket(auth: AuthState | null, payload: {
  ticketId: string;
  message: string;
  photoUrls?: string[];
}): Promise<TicketItem> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<TicketItem | {
      data: TicketItem;
    }>(`/mobile/customer/support/tickets/${payload.ticketId}/reply`, {
      method: "POST",
      token: session.token,
      body: JSON.stringify(payload)
    });
    return unwrapData(response);
  } catch {
    return mockReplyToTicket(payload);
  }
}
import { getDailyReports, getDailyReport, saveDailyReport } from "./mock-data";
export { mockHandoverInfo } from "./mock-data";
export async function getFieldDailyReports(auth: AuthState | null, params?: {
  month?: string;
  includeDraft?: boolean;
}): Promise<DailyReport[]> {
  const session = ensureAuth(auth);
  try {
    const query = new URLSearchParams();
    if (params?.month) {
      query.set("month", params.month);
    }
    if (params?.includeDraft !== undefined) {
      query.set("includeDraft", String(params.includeDraft));
    }
    const response = await requestJson<DailyReport[] | {
      data: DailyReport[];
    }>(`/mobile/field/reports${query.toString() ? `?${query.toString()}` : ""}`, {
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return getDailyReports(session.user.id, params);
  }
}
export async function getFieldDailyReport(auth: AuthState | null, reportId: string): Promise<DailyReport | null> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<DailyReport | {
      data: DailyReport;
    } | null>(`/mobile/field/reports/${reportId}`, {
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return getDailyReport(reportId);
  }
}
export async function submitDailyReport(auth: AuthState | null, payload: {
  date: string;
  projectId?: string;
  unitId?: string;
  summary: string;
  activities: string[];
  issues: string[];
  weather: DailyReport["weather"];
  temperature?: number;
  photoUrls: string[];
  isDraft: boolean;
}): Promise<DailyReport> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<DailyReport | {
      data: DailyReport;
    }>("/mobile/field/reports", {
      method: "POST",
      token: session.token,
      body: JSON.stringify(payload)
    });
    return unwrapData(response);
  } catch {
    return saveDailyReport({
      userId: session.user.id,
      userName: session.user.fullName,
      ...payload
    });
  }
}
export async function getHandoverInfo(unitId: string): Promise<HandoverInfo> {
  try {
    const response = await requestJson<HandoverInfo | {
      data: HandoverInfo;
    }>(`/mobile/customer/handover/${unitId}`);
    return unwrapData(response);
  } catch {
    return {
      ...mockHandoverInfo,
      unitId
    };
  }
}

// --- PRE-BAST INSPECTION API ---

let mockBookings = [
  { id: "b1", unitId: "u1", unit: { code: "A-01", typeName: "Type 36", progress: 100, statusPembangunan: "Siap Huni" }, scheduleDate: "2026-06-21", customerName: "Budi Santoso", status: "TERJADWAL" },
  { id: "b2", unitId: "u2", unit: { code: "B-05", typeName: "Type 45", progress: 100, statusPembangunan: "Siap Huni" }, scheduleDate: "2026-06-22", customerName: "Andi Wijaya", status: "TERJADWAL" }
];

let mockDefects = [
  { id: "d1", bookingId: "b1", description: "Cat dinding terkelupas sedikit di area ruang tamu", status: "DILAPORKAN", photoUrl: "https://via.placeholder.com/300", createdAt: new Date().toISOString() },
  { id: "d2", bookingId: "b1", description: "Keran air wastafel bocor", status: "DIPERBAIKI", photoUrl: "https://via.placeholder.com/300", createdAt: new Date().toISOString() }
];


export async function getInspectionBookings(auth: AuthState): Promise<any[]> {
  const session = ensureAuth(auth);
  try {
    const response = await fetch(`${API_BASE_URL}/api/legal/bookings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.token}`
      }
    });
    if (!response.ok) {
      throw new Error("Gagal mengambil data unit inspeksi");
    }
    const resData = await response.json();
    return resData.data || [];
  } catch {
    return mockBookings;
  }
}
export async function getInspectionDefects(auth: AuthState, bookingId: string): Promise<any[]> {
  const session = ensureAuth(auth);
  try {
    const response = await fetch(`${API_BASE_URL}/api/legal/defects`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.token}`
      }
    });
    if (!response.ok) {
      throw new Error("Gagal mengambil data komplain unit");
    }
    const resData = await response.json();
    const allDefects = resData.data || [];
    return allDefects.filter((d: any) => d.bookingId === bookingId);
  } catch {
    return mockDefects.filter((d) => d.bookingId === bookingId);
  }
}
export async function updateDefectStatus(auth: AuthState, defectId: string, status: string): Promise<void> {
  const session = ensureAuth(auth);
  try {
    const response = await fetch(`${API_BASE_URL}/api/legal/defects/${defectId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`
      },
      body: JSON.stringify({
        status
      })
    });
    if (!response.ok) {
      throw new Error("Gagal memperbarui status komplain");
    }
  } catch {
    const defect = mockDefects.find((d) => d.id === defectId);
    if (defect) {
      defect.status = status;
    }
  }
}