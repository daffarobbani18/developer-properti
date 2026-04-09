export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: "SITE_ENGINEER" | "PROJECT_MANAGER";
};

export type AuthState = {
  token: string;
  user: AuthUser;
};

export type PendingQueueItem = {
  type: "MILESTONE_UPDATE";
  payload: {
    milestoneId: string;
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    note?: string;
  };
  createdAt: string;
};
