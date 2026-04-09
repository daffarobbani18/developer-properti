export const ROLES = [
  "DIRECTOR",
  "SALES_MANAGER",
  "SALES",
  "FINANCE_MANAGER",
  "FINANCE_ADMIN",
  "PROJECT_MANAGER",
  "SITE_ENGINEER",
  "LEGAL_ADMIN",
  "CUSTOMER"
] as const;

export type Role = (typeof ROLES)[number];

export const LEAD_STATUSES = [
  "NEW",
  "FOLLOW_UP",
  "SURVEY",
  "NEGOTIATION",
  "BOOKING",
  "SPK",
  "CLOSED"
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const UNIT_STATUSES = ["AVAILABLE", "BOOKED", "SOLD", "INDENT"] as const;
export type UnitStatus = (typeof UNIT_STATUSES)[number];

export const INVOICE_STATUSES = ["UNPAID", "PENDING_VERIFICATION", "PAID", "OVERDUE"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const TICKET_STATUSES = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const MILESTONE_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"] as const;
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

export const VENDOR_APPROVAL_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export type VendorApprovalStatus = (typeof VENDOR_APPROVAL_STATUSES)[number];

export type ApiResponse<T> = {
  data: T;
  message?: string;
};
