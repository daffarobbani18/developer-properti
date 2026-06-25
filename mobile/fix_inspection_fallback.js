const fs = require('fs');

const file = 'src/services/api.ts';
let content = fs.readFileSync(file, 'utf8');

const mockDataBlock = `
let mockBookings = [
  { id: "b1", unitId: "u1", unit: { code: "A-01", typeName: "Type 36", progress: 100, statusPembangunan: "Siap Huni" }, scheduleDate: "2026-06-21", customerName: "Budi Santoso", status: "TERJADWAL" },
  { id: "b2", unitId: "u2", unit: { code: "B-05", typeName: "Type 45", progress: 100, statusPembangunan: "Siap Huni" }, scheduleDate: "2026-06-22", customerName: "Andi Wijaya", status: "TERJADWAL" }
];

let mockDefects = [
  { id: "d1", bookingId: "b1", description: "Cat dinding terkelupas sedikit di area ruang tamu", status: "DILAPORKAN", photoUrl: "https://via.placeholder.com/300", createdAt: new Date().toISOString() },
  { id: "d2", bookingId: "b1", description: "Keran air wastafel bocor", status: "DIPERBAIKI", photoUrl: "https://via.placeholder.com/300", createdAt: new Date().toISOString() }
];
`;

if (!content.includes('let mockBookings =')) {
  content = content.replace('// --- PRE-BAST INSPECTION API ---', '// --- PRE-BAST INSPECTION API ---\n' + mockDataBlock);
}

// 1. getInspectionBookings
content = content.replace(
`export async function getInspectionBookings(auth: AuthState): Promise<any[]> {
  const session = ensureAuth(auth);
  const response = await fetch(\`\${API_BASE_URL}/api/legal/bookings\`, {
    method: "GET",
    headers: {
      Authorization: \`Bearer \${session.token}\`
    }
  });
  if (!response.ok) {
    throw new Error("Gagal mengambil data unit inspeksi");
  }
  const resData = await response.json();
  return resData.data || [];
}`,
`export async function getInspectionBookings(auth: AuthState): Promise<any[]> {
  const session = ensureAuth(auth);
  try {
    const response = await fetch(\`\${API_BASE_URL}/api/legal/bookings\`, {
      method: "GET",
      headers: {
        Authorization: \`Bearer \${session.token}\`
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
}`);

// 2. getInspectionDefects
content = content.replace(
`export async function getInspectionDefects(auth: AuthState, bookingId: string): Promise<any[]> {
  const session = ensureAuth(auth);
  const response = await fetch(\`\${API_BASE_URL}/api/legal/defects\`, {
    method: "GET",
    headers: {
      Authorization: \`Bearer \${session.token}\`
    }
  });
  if (!response.ok) {
    throw new Error("Gagal mengambil data komplain unit");
  }
  const resData = await response.json();
  const allDefects = resData.data || [];
  return allDefects.filter((d: any) => d.bookingId === bookingId);
}`,
`export async function getInspectionDefects(auth: AuthState, bookingId: string): Promise<any[]> {
  const session = ensureAuth(auth);
  try {
    const response = await fetch(\`\${API_BASE_URL}/api/legal/defects\`, {
      method: "GET",
      headers: {
        Authorization: \`Bearer \${session.token}\`
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
}`);

// 3. updateDefectStatus
content = content.replace(
`export async function updateDefectStatus(auth: AuthState, defectId: string, status: string): Promise<void> {
  const session = ensureAuth(auth);
  const response = await fetch(\`\${API_BASE_URL}/api/legal/defects/\${defectId}/status\`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${session.token}\`
    },
    body: JSON.stringify({
      status
    })
  });
  if (!response.ok) {
    throw new Error("Gagal memperbarui status komplain");
  }
}`,
`export async function updateDefectStatus(auth: AuthState, defectId: string, status: string): Promise<void> {
  const session = ensureAuth(auth);
  try {
    const response = await fetch(\`\${API_BASE_URL}/api/legal/defects/\${defectId}/status\`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${session.token}\`
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
}`);

// 4. createInspectionDefect (at line 183)
content = content.replace(
`export async function createInspectionDefect(auth: AuthState | null, bookingId: string, description: string, imageUri?: string | null): Promise<any> {
  const session = ensureAuth(auth);
  const formData = new FormData();
  formData.append("bookingId", bookingId);
  formData.append("description", description);

  if (imageUri) {
    const filename = imageUri.split('/').pop() || "photo.jpg";
    const match = /\\.(\\w+)$/.exec(filename);
    const type = match ? \`image/\${match[1]}\` : \`image\`;
    formData.append("file", { uri: imageUri, name: filename, type } as any);
  }

  const response = await fetch(\`\${API_BASE_URL}/api/legal/defects\`, {
    method: "POST",
    headers: { Authorization: \`Bearer \${session.token}\` },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || \`Server error: \${response.status}\`);
  }

  return response.json();
}`,
`export async function createInspectionDefect(auth: AuthState | null, bookingId: string, description: string, imageUri?: string | null): Promise<any> {
  const session = ensureAuth(auth);
  try {
    const formData = new FormData();
    formData.append("bookingId", bookingId);
    formData.append("description", description);

    if (imageUri) {
      const filename = imageUri.split('/').pop() || "photo.jpg";
      const match = /\\.(\\w+)$/.exec(filename);
      const type = match ? \`image/\${match[1]}\` : \`image\`;
      formData.append("file", { uri: imageUri, name: filename, type } as any);
    }

    const response = await fetch(\`\${API_BASE_URL}/api/legal/defects\`, {
      method: "POST",
      headers: { Authorization: \`Bearer \${session.token}\` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || \`Server error: \${response.status}\`);
    }

    return response.json();
  } catch {
    const newDefect = {
      id: \`d-\${Date.now()}\`,
      bookingId,
      description,
      status: "DILAPORKAN",
      photoUrl: imageUri || "https://via.placeholder.com/300",
      createdAt: new Date().toISOString()
    };
    mockDefects.push(newDefect);
    return { data: newDefect };
  }
}`);

fs.writeFileSync(file, content);
console.log('Restored try-catch fallbacks to mock data for Inspection APIs');
