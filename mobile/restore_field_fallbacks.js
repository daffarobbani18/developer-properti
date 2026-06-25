const fs = require('fs');

const file = 'src/services/api.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. getFieldProjects
content = content.replace(
`export async function getFieldProjects(auth: AuthState | null): Promise<ProjectSummary[]> {
  const session = ensureAuth(auth);
  const response = await requestJson<ProjectSummary[] | {
    data: ProjectSummary[];
  }>("/mobile/field/projects", {
    token: session.token
  });
  return unwrapData(response);
}`,
`export async function getFieldProjects(auth: AuthState | null): Promise<ProjectSummary[]> {
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
}`);

// 2. getProjectOptions
content = content.replace(
`export async function getProjectOptions(auth: AuthState | null): Promise<ProjectSummary[]> {
  const session = ensureAuth(auth);
  const response = await requestJson<ProjectSummary[] | {
    data: ProjectSummary[];
  }>("/mobile/field/project-options", {
    token: session.token
  });
  return unwrapData(response);
}`,
`export async function getProjectOptions(auth: AuthState | null): Promise<ProjectSummary[]> {
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
}`);

// 3. getFieldUnits
content = content.replace(
`export async function getFieldUnits(auth: AuthState | null, params?: {
  projectId?: string;
  search?: string;
}): Promise<Unit[]> {
  const session = ensureAuth(auth);
  const query = new URLSearchParams();
  if (params?.projectId) {
    query.set("projectId", params.projectId);
  }
  if (params?.search) {
    query.set("search", params.search);
  }
  const path = \`/mobile/field/units\${query.toString() ? \`?\${query.toString()}\` : ""}\`;
  const response = await requestJson<Unit[] | {
    data: Unit[];
  }>(path, {
    token: session.token
  });
  return unwrapData(response);
}`,
`export async function getFieldUnits(auth: AuthState | null, params?: {
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
    const path = \`/mobile/field/units\${query.toString() ? \`?\${query.toString()}\` : ""}\`;
    const response = await requestJson<Unit[] | {
      data: Unit[];
    }>(path, {
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return getUnits(params?.projectId, params?.search);
  }
}`);

// 4. getUnitMilestones
content = content.replace(
`export async function getUnitMilestones(auth: AuthState | null, unitId: string): Promise<Milestone[]> {
  const session = ensureAuth(auth);
  const response = await requestJson<Milestone[] | {
    data: Milestone[];
  }>(\`/mobile/field/units/\${unitId}/milestones\`, {
    token: session.token
  });
  return unwrapData(response);
}`,
`export async function getUnitMilestones(auth: AuthState | null, unitId: string): Promise<Milestone[]> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<Milestone[] | {
      data: Milestone[];
    }>(\`/mobile/field/units/\${unitId}/milestones\`, {
      token: session.token
    });
    return unwrapData(response);
  } catch {
    return getMilestones(unitId);
  }
}`);

// 5. submitMilestoneUpdate
content = content.replace(
`export async function submitMilestoneUpdate(auth: AuthState | null, payload: {
  milestoneId: string;
  status: Milestone["status"];
  note?: string;
  photoUrl?: string;
  photoUrls?: string[];
}): Promise<Milestone> {
  const session = ensureAuth(auth);
  const response = await requestJson<Milestone | {
    data: Milestone;
  }>(\`/mobile/field/milestones/\${payload.milestoneId}\`, {
    method: "PATCH",
    token: session.token,
    body: JSON.stringify(payload)
  });
  return unwrapData(response);
}`,
`export async function submitMilestoneUpdate(auth: AuthState | null, payload: {
  milestoneId: string;
  status: Milestone["status"];
  note?: string;
  photoUrl?: string;
  photoUrls?: string[];
}): Promise<Milestone> {
  const session = ensureAuth(auth);
  try {
    const response = await requestJson<Milestone | {
      data: Milestone;
    }>(\`/mobile/field/milestones/\${payload.milestoneId}\`, {
      method: "PATCH",
      token: session.token,
      body: JSON.stringify(payload)
    });
    return unwrapData(response);
  } catch {
    return updateMilestone(payload);
  }
}`);

// Fix exports if getProjectSummaries is missing from imports
if (!content.includes('getProjectSummaries')) {
   content = content.replace(/import \{ AuthState, BillingSummary/g, 'import { getProjectSummaries } from "./mock-data";\\nimport { AuthState, BillingSummary');
}

fs.writeFileSync(file, content);
console.log('Restored try-catch fallbacks to mock data in api.ts');
