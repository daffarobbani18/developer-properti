import { NotificationItem } from "../types";

export function inferSeverity(n: NotificationItem): "critical" | "warning" | "info" {
  if (n.severity) return n.severity;
  const title = n.title.toLowerCase();
  const type = (n.type || "") as string;
  if (title.includes('deadline') || title.includes('critical') || title.includes('terlambat') || title.includes('kekurangan') || type === 'deadline_alert') {
    return "critical";
  }
  if (title.includes('defect') || title.includes('perhatian') || type === 'defect_alert') {
    return "warning";
  }
  return "info";
}

export function inferActionType(n: NotificationItem): string | undefined {
  if (n.actionType) return n.actionType;
  if (n.data?.route) return n.data.route;
  
  const type = (n.type || "").toUpperCase();
  if (type === 'PROJECT_UPDATE') return 'progress';
  if (type === 'PAYMENT_UPDATE') return 'billing';
  if (type === 'GENERAL_INFO') return 'informasi';
  
  return n.type;
}

export function getPriorityScore(severity: "critical" | "warning" | "info"): number {
  if (severity === "critical") return 3;
  if (severity === "warning") return 2;
  return 1;
}

export function mapRawNotificationToUI(n: NotificationItem, localRead: Set<string>, localResolved: Set<string>): NotificationItem {
  let isRead = n.isRead;
  let isResolved = n.isResolved;
  
  if (localResolved.has(n.id)) {
    isRead = true;
    isResolved = true;
  } else if (localRead.has(n.id)) {
    isRead = true;
  }
  
  return {
    ...n,
    isRead,
    isResolved,
    severity: inferSeverity(n),
    actionType: inferActionType(n)
  };
}
