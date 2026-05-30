// [UI-FIX-V2] Remediation based on design-spec + audit — SIMDP Mobile v1.1
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "baru saja";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} menit lalu`;
  }
  if (diffHours < 24) {
    return `${diffHours} jam lalu`;
  }
  if (diffDays === 1) {
    return "kemarin";
  }
  return `${diffDays} hari lalu`;
}

export function isOverdue(dueDateStr: string): boolean {
  return new Date(dueDateStr) < new Date();
}