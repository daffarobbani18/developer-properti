import {
  AuthState,
  BillingSummary,
  CustomerOverview,
  DocumentItem,
  FaqItem,
  InvoiceItem,
  IssueItem,
  Milestone,
  NotificationItem,
  PaymentItem,
  ProjectSummary,
  TicketItem,
  Unit,
} from "../types";
import {
  addIssue,
  authenticateMock,
  createTicket,
  getBillingData,
  getCustomerOverview,
  getCustomerProgress,
  getDocuments,
  getIssues,
  getMilestones,
  getNotifications,
  getProjectSummaries,
  getProjects,
  getSupportData,
  getUnits,
  markNotificationsRead,
  updateIssueStatus,
  updateMilestone,
  uploadPaymentProof,
} from "./mock-data";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
const REQUEST_TIMEOUT_MS = 2500;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("API timeout"));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

function buildHeaders(token?: string, headers?: HeadersInit): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers ?? {}),
  };
}

async function requestJson<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const response = await withTimeout(
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: buildHeaders(options?.token, options?.headers),
    }),
    REQUEST_TIMEOUT_MS
  );

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}

function unwrapData<T>(input: T | { data: T }): T {
  if (typeof input === "object" && input !== null && "data" in input) {
    return (input as { data: T }).data;
  }
  return input as T;
}

function normalizeAuthResponse(payload: unknown): AuthState | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = "data" in payload ? (payload as { data: unknown }).data : payload;

  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  if (!("token" in candidate) || !("user" in candidate)) {
    return null;
  }

  const token = (candidate as { token?: unknown }).token;
  const user = (candidate as { user?: unknown }).user;

  if (
    typeof token !== "string" ||
    !user ||
    typeof user !== "object" ||
    !("id" in user) ||
    !("fullName" in user) ||
    !("email" in user) ||
    !("role" in user)
  ) {
    return null;
  }

  return {
    token,
    user: {
      id: String((user as { id: unknown }).id),
      fullName: String((user as { fullName: unknown }).fullName),
      email: String((user as { email: unknown }).email),
      role: (user as { role: AuthState["user"]["role"] }).role,
    },
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
    const response = await requestJson<unknown>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
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
    const response = await requestJson<ProjectSummary[] | { data: ProjectSummary[] }>(
      "/mobile/field/projects",
      { token: session.token }
    );
    return unwrapData(response);
  } catch {
    return getProjectSummaries();
  }
}

export async function getProjectOptions(
  auth: AuthState | null
): Promise<Array<{ id: string; name: string }>> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<Array<{ id: string; name: string }> | { data: Array<{ id: string; name: string }> }>(
      "/mobile/field/project-options",
      { token: session.token }
    );
    return unwrapData(response);
  } catch {
    return getProjects();
  }
}

export async function getFieldUnits(
  auth: AuthState | null,
  params?: { projectId?: string; search?: string }
): Promise<Unit[]> {
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
    const response = await requestJson<Unit[] | { data: Unit[] }>(path, {
      token: session.token,
    });
    return unwrapData(response);
  } catch {
    return getUnits(params?.projectId, params?.search);
  }
}

export async function getUnitMilestones(
  auth: AuthState | null,
  unitId: string
): Promise<Milestone[]> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<Milestone[] | { data: Milestone[] }>(
      `/mobile/field/units/${unitId}/milestones`,
      {
        token: session.token,
      }
    );
    return unwrapData(response);
  } catch {
    return getMilestones(unitId);
  }
}

export async function submitMilestoneUpdate(
  auth: AuthState | null,
  payload: {
    milestoneId: string;
    status: Milestone["status"];
    note?: string;
    photoUrl?: string;
  }
): Promise<Milestone> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<Milestone | { data: Milestone }>(
      `/mobile/field/milestones/${payload.milestoneId}`,
      {
        method: "PATCH",
        token: session.token,
        body: JSON.stringify(payload),
      }
    );
    return unwrapData(response);
  } catch {
    return updateMilestone(payload);
  }
}

export async function getFieldIssues(auth: AuthState | null): Promise<IssueItem[]> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<IssueItem[] | { data: IssueItem[] }>("/mobile/field/issues", {
      token: session.token,
    });
    return unwrapData(response);
  } catch {
    return getIssues();
  }
}

export async function createFieldIssue(
  auth: AuthState | null,
  payload: {
    projectId: string;
    unitId?: string;
    title: string;
    description: string;
    category: IssueItem["category"];
    urgency: IssueItem["urgency"];
    reporterName: string;
    recommendation?: string;
  }
): Promise<IssueItem> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<IssueItem | { data: IssueItem }>("/mobile/field/issues", {
      method: "POST",
      token: session.token,
      body: JSON.stringify(payload),
    });
    return unwrapData(response);
  } catch {
    return addIssue(payload);
  }
}

export async function changeIssueStatus(
  auth: AuthState | null,
  issueId: string,
  status: IssueItem["status"]
): Promise<IssueItem> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<IssueItem | { data: IssueItem }>(
      `/mobile/field/issues/${issueId}`,
      {
        method: "PATCH",
        token: session.token,
        body: JSON.stringify({ status }),
      }
    );
    return unwrapData(response);
  } catch {
    return updateIssueStatus(issueId, status);
  }
}

export async function getRoleNotifications(
  auth: AuthState | null
): Promise<NotificationItem[]> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<NotificationItem[] | { data: NotificationItem[] }>(
      "/mobile/notifications",
      {
        token: session.token,
      }
    );
    return unwrapData(response);
  } catch {
    return getNotifications(session.user.role);
  }
}

export async function markNotificationsAsRead(
  auth: AuthState | null
): Promise<NotificationItem[]> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<NotificationItem[] | { data: NotificationItem[] }>(
      "/mobile/notifications/mark-read",
      {
        method: "POST",
        token: session.token,
      }
    );
    return unwrapData(response);
  } catch {
    return markNotificationsRead(session.user.role);
  }
}

export async function getCustomerOverviewData(
  auth: AuthState | null
): Promise<CustomerOverview> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<CustomerOverview | { data: CustomerOverview }>(
      "/mobile/customer/overview",
      {
        token: session.token,
      }
    );
    return unwrapData(response);
  } catch {
    return getCustomerOverview();
  }
}

export async function getCustomerProgressData(
  auth: AuthState | null
): Promise<Milestone[]> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<Milestone[] | { data: Milestone[] }>(
      "/mobile/customer/progress",
      {
        token: session.token,
      }
    );
    return unwrapData(response);
  } catch {
    return getCustomerProgress();
  }
}

export async function getCustomerBillingData(
  auth: AuthState | null
): Promise<{ summary: BillingSummary; invoices: InvoiceItem[]; payments: PaymentItem[] }> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<
      { summary: BillingSummary; invoices: InvoiceItem[]; payments: PaymentItem[] } | {
        data: { summary: BillingSummary; invoices: InvoiceItem[]; payments: PaymentItem[] };
      }
    >("/mobile/customer/billing", {
      token: session.token,
    });
    return unwrapData(response);
  } catch {
    return getBillingData();
  }
}

export async function submitPaymentProof(
  auth: AuthState | null,
  payload: { invoiceId: string; amount: number; proofUrl: string }
): Promise<PaymentItem> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<PaymentItem | { data: PaymentItem }>(
      "/mobile/customer/payments",
      {
        method: "POST",
        token: session.token,
        body: JSON.stringify(payload),
      }
    );
    return unwrapData(response);
  } catch {
    return uploadPaymentProof(payload);
  }
}

export async function getCustomerDocuments(
  auth: AuthState | null
): Promise<DocumentItem[]> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<DocumentItem[] | { data: DocumentItem[] }>(
      "/mobile/customer/documents",
      {
        token: session.token,
      }
    );
    return unwrapData(response);
  } catch {
    return getDocuments();
  }
}

export async function getCustomerSupportData(
  auth: AuthState | null
): Promise<{ tickets: TicketItem[]; faq: FaqItem[] }> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<{ tickets: TicketItem[]; faq: FaqItem[] } | { data: { tickets: TicketItem[]; faq: FaqItem[] } }>(
      "/mobile/customer/support",
      {
        token: session.token,
      }
    );
    return unwrapData(response);
  } catch {
    return getSupportData();
  }
}

export async function createCustomerTicket(
  auth: AuthState | null,
  payload: {
    category: TicketItem["category"];
    subject: string;
    description: string;
  }
): Promise<TicketItem> {
  const session = ensureAuth(auth);

  try {
    const response = await requestJson<TicketItem | { data: TicketItem }>(
      "/mobile/customer/support/tickets",
      {
        method: "POST",
        token: session.token,
        body: JSON.stringify(payload),
      }
    );
    return unwrapData(response);
  } catch {
    return createTicket(payload);
  }
}
