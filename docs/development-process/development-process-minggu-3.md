# DEVELOPMENT PROCESS MINGGU KE-3

**Project:** Ekosistem Digital Properti Terpadu  
**Periode:** 2026-04-17 - 2026-04-23  
**Minggu ke:** 3  
**PIC:** Tim Frontend Web Admin

---

## 1. Tujuan Minggu Ini

Tujuan minggu ke-3 adalah memperkuat pengendalian akses route berbasis role agar tidak ada celah dari sisi direct URL access. Fokus tambahan minggu ini adalah menyelesaikan alur logout yang aman dan menstabilkan routing dashboard.

Dengan selesainya tujuan ini, sistem tidak lagi hanya mengandalkan pembatasan menu di UI, tetapi sudah memiliki validasi akses pada lapisan route handling.

---

## 2. Proses yang Dilakukan

### A. Planning

**Scope yang disepakati:**
1. Mengganti pendekatan guard agar sesuai pola terbaru framework (proxy-based guard).
2. Menentukan matrix role terhadap route prefix yang diizinkan.
3. Menyusun skenario redirect fallback jika user masuk ke route yang tidak sesuai role.
4. Menambahkan logout flow yang menutup seluruh session artifact.

**Out of scope minggu ini:**
1. Integrasi API real untuk dashboard.
2. Penambahan widget analitik tambahan.

### B. Development

**Aktivitas utama:**
1. Implementasi role home mapping untuk redirect yang konsisten.
2. Implementasi role allowed prefix mapping untuk pembatasan akses route.
3. Validasi cookie role pada request route terproteksi.
4. Redirect otomatis dari root ke dashboard role masing-masing.
5. Implementasi dialog konfirmasi logout pada sidebar.
6. Implementasi pembersihan session menyeluruh saat logout.
7. Perbaikan bug routing dashboard yang menyebabkan user terpental ke login.

**Langkah teknis proses:**
1. Menentukan route public yang boleh diakses tanpa autentikasi.
2. Menentukan route protected yang wajib validasi role.
3. Menjalankan pengujian manual direct URL untuk semua role.
4. Menyamakan perilaku logout antara state UI dan state session.

### C. Review & Testing

**Skenario testing yang dijalankan:**
1. Login role admin lalu akses route role lain.
2. Login role sales/inventory/finance/legal/supervisor lalu akses route admin.
3. Akses root route setelah login dan setelah logout.
4. Uji logout lalu akses route protected via URL manual.

**Hasil testing:**
1. Route yang tidak sesuai role berhasil ditolak.
2. Root route berhasil mengarahkan ke dashboard role.
3. Loop routing dashboard ke login berhasil dihilangkan.
4. Logout flow berhasil membersihkan session.

### D. Deployment/Environment

**Environment:** Local development + build verification

**Status build:** Berhasil

**Catatan environment:**
1. Penyesuaian konfigurasi guard dilakukan agar tidak muncul warning pola lama.
2. Tidak ada error TypeScript baru dari perubahan minggu ini.

### E. Review Tim

Hasil review menyimpulkan guard route sudah stabil dan siap menjadi baseline untuk pengembangan dashboard role-based pada sprint berikutnya.

---

## 3. Hasil Proses Minggu Ini

1. Pengamanan route berbasis role selesai.
2. Logout flow aman dan dapat diuji end-to-end.
3. Masalah routing dashboard selesai.
4. Fondasi navigasi untuk dashboard per role siap dipakai.

---

## 4. Blocker, Risiko, dan Mitigasi

**Blocker yang terjadi:**
1. Warning dan ketidaksesuaian pada pola guard lama.
2. Konflik perilaku redirect antara root route dan dashboard route.

**Risiko:**
1. Salah konfigurasi matrix prefix role dapat menyebabkan false redirect.

**Mitigasi:**
1. Menetapkan daftar prefix per role secara eksplisit.
2. Menambah pengujian lintas role dengan skenario akses URL manual.
3. Menjadikan role home sebagai fallback tunggal.

---

## 5. Keputusan Minggu Ini

1. Menjadikan proxy guard sebagai baseline kontrol akses route web admin.
2. Menstandarkan alur root redirect ke role home.
3. Menetapkan logout sebagai proses pembersihan session menyeluruh, bukan hanya redirect UI.

---

## 6. Action Minggu Berikutnya

| Action Item | PIC | Due Date |
|------------|-----|----------|
| Implementasi dashboard per role dengan route dinamis | Frontend Web Admin | Minggu ke-4 |
| Integrasi KPI dashboard dari data dummy modul | Frontend Web Admin | Minggu ke-4 |
| Menambah snapshot section untuk prioritas role | Frontend Web Admin | Minggu ke-4 |
| Menjalankan build final dan verifikasi deployment web admin | Frontend Web Admin | Minggu ke-4 |

---

## 7. Rincian Teknis Implementasi

Detail teknis minggu ke-3 berpusat pada transisi dari keamanan level UI ke keamanan level route:

1. Rincian Role Home Mapping:
	- Menetapkan destination default untuk setiap role.
	- Mapping ini dipakai untuk root redirect dan fallback unauthorized access.
2. Rincian Allowed Prefix Matrix:
	- Menentukan daftar prefix route yang diizinkan per role.
	- Matrix dipakai sebagai sumber keputusan allow/deny pada route protection.
3. Rincian Proxy Guard:
	- Menambahkan validasi role dari cookie request.
	- Menambahkan pengalihan otomatis ke role home saat ditemukan akses di luar izin.
4. Rincian Logout Flow:
	- Menambahkan dialog konfirmasi agar user tidak logout tidak sengaja.
	- Menambahkan cleanup session state secara menyeluruh saat logout dipastikan.
5. Rincian Bug Fix Routing:
	- Menyesuaikan target route menu dashboard agar tidak memicu loop ke halaman login.

---

## 8. Matrix Pengujian Minggu Ini

| Skenario Uji | Metode | Hasil |
|--------------|--------|-------|
| Akses root setelah login role valid | Manual browser | Pass |
| Akses URL role lain via direct URL | Manual browser | Pass (Redirect/Fallback) |
| Logout dari sidebar dengan konfirmasi | Manual browser | Pass |
| Akses route protected setelah logout | Manual browser | Pass (Ditolak) |
| Klik menu dashboard berulang | Manual browser | Pass |

Catatan matrix:
1. Pengujian dilakukan lintas role untuk memastikan matrix izin bekerja konsisten.
2. Fokus test utama adalah menutup celah bypass melalui URL manual.

---

## 9. Artefak Output Engineering

1. Konfigurasi guard route berbasis role.
2. Mapping role home dan allowed prefix.
3. Dialog konfirmasi logout.
4. Perbaikan routing dashboard.
5. Catatan skenario uji direct URL lintas role.

Artefak ini dipakai langsung sebagai fondasi implementasi dashboard role-based minggu ke-4.

---

## 10. Lessons Learned Minggu Ini

1. Pembatasan menu saja tidak cukup; validasi route wajib dilakukan pada lapisan request.
2. Root redirect yang tidak role-aware mudah memicu perilaku loop yang sulit didiagnosis.
3. Logout yang tidak membersihkan semua state session berpotensi menimbulkan bug phantom session.
4. Matrix izin harus eksplisit, karena aturan implisit cenderung memunculkan celah akses.

---

## 11. Cuplikan Source Code Penting Minggu Ini

### A. Matrix Prefix Route yang Diizinkan per Role

File: `frontend/web-admin/src/proxy.ts`

```ts
const ROLE_ALLOWED_PREFIXES: Record<UserRole, string[]> = {
	admin: ["/dashboard", "/crm", "/finance", "/inventory", "/keuangan", "/legal", "/proyek", "/sales", "/supervisor"],
	inventory: ["/dashboard/inventory", "/inventory", "/proyek"],
	sales: ["/dashboard/sales", "/sales", "/crm"],
	finance: ["/dashboard/finance", "/finance", "/keuangan"],
	legal: ["/dashboard/legal", "/legal"],
	supervisor: ["/dashboard/supervisor", "/supervisor", "/proyek"],
};
```

Penjelasan singkat:
1. Snippet ini adalah jantung authorization rule minggu ke-3.
2. Daftar prefix dipakai untuk memutuskan route allow/deny secara konsisten.

### B. Guard Logic pada Proxy

File: `frontend/web-admin/src/proxy.ts`

```ts
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const roleCookie = request.cookies.get("simdp_role")?.value;
	const role = VALID_ROLES.includes(roleCookie as UserRole) ? (roleCookie as UserRole) : null;

	if (pathname === "/") {
		if (!role) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
	}

	if (!role) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	const allowedPrefixes = ROLE_ALLOWED_PREFIXES[role];
	if (!isAllowedByPrefix(pathname, allowedPrefixes)) {
		return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
	}

	return NextResponse.next();
}
```

Penjelasan singkat:
1. Route tidak lagi hanya dibatasi di layer UI.
2. Semua request route protected diputuskan melalui role cookie dan matrix prefix.

### C. Logout Cleanup Menyeluruh

File: `frontend/web-admin/src/components/layout/sidebar.tsx`

```tsx
const handleLogout = () => {
	try {
		localStorage.removeItem("simdp_auth");
		sessionStorage.removeItem("simdp_auth");
		document.cookie = "simdp_role=; path=/; max-age=0; samesite=lax";
		document.cookie = "simdp_email=; path=/; max-age=0; samesite=lax";
	} catch {
		// Ignore storage/cookie errors and continue redirect.
	}

	onClose?.();
	setShowLogoutConfirm(false);
	router.replace("/login");
};
```

Penjelasan singkat:
1. Pembersihan session dilakukan lintas storage + cookie.
2. Ini memastikan route protected tidak bisa diakses ulang via session lama.

---

**Catatan:** Dokumen ini hanya memuat proses yang benar-benar sudah terjadi pada minggu ke-3.