# DEVELOPMENT PROCESS MINGGU KE-2

**Project:** Ekosistem Digital Properti Terpadu  
**Periode:** 2026-04-10 - 2026-04-16  
**Minggu ke:** 2  
**PIC:** Tim Frontend Web Admin

---

## 1. Tujuan Minggu Ini

Tujuan utama minggu ke-2 adalah menuntaskan fondasi role-based authentication flow di web admin pada level antarmuka pengguna. Fokus diarahkan pada tiga hal: konsistensi desain login, redirect role otomatis, dan relevansi menu sesuai role.

Target tidak diarahkan ke fitur bisnis baru, tetapi ke stabilitas alur masuk user agar tahap pengamanan route di minggu berikutnya dapat dilakukan tanpa mengubah UX login lagi.

---

## 2. Proses yang Dilakukan

### A. Planning

**Scope yang disepakati di awal minggu:**
1. Login page harus kembali sesuai desain referensi awal.
2. Role mapping harus eksplisit per akun dev.
3. Redirect pasca-login harus otomatis dan deterministik.
4. Sidebar harus membaca role aktif untuk menampilkan menu yang tepat.

**Batasan scope:**
1. Tidak melakukan integrasi backend auth real.
2. Tidak mengubah domain fitur mobile.
3. Tidak menambahkan modul bisnis baru.

### B. Development

**Aktivitas utama yang dikerjakan:**
1. Rework halaman login untuk mengembalikan visual concept dark premium.
2. Menambah logic role mapping dari akun dev ke route dashboard role.
3. Menambah penyimpanan session pada browser untuk role/email.
4. Menyesuaikan komponen sidebar untuk melakukan filtering menu berbasis role.

**Detail implementasi proses:**
1. Menyusun daftar akun dev dan role terkait.
2. Menentukan route home untuk setiap role.
3. Menyatukan data role agar dipakai bersama oleh login dan layout sidebar.
4. Menguji role-switching berulang untuk memastikan state selalu konsisten.

### C. Review & Testing

**Skenario uji yang dijalankan:**
1. Login role admin, verifikasi redirect dan menu.
2. Login role sales, verifikasi menu terbatas.
3. Login role finance/legal/supervisor, verifikasi konsistensi route awal.
4. Refresh halaman setelah login untuk memastikan state tetap terbaca.

**Hasil testing:**
1. Redirect role berjalan sesuai skenario.
2. Filtering menu berhasil pada role yang diuji.
3. Tidak ditemukan error TypeScript dari perubahan minggu ini.

### D. Deployment/Environment

**Environment:** Local development

**Aktivitas environment:**
1. Build lokal untuk validasi kompilasi.
2. Verifikasi route hasil redirect di browser lokal.

**Status:** Berhasil

### E. Review Tim

Review akhir minggu menyimpulkan bahwa alur login-redirect-menu sudah cukup stabil untuk dilanjutkan ke fase route authorization server-side. Tim menyetujui bahwa pengamanan URL langsung (deep link access) menjadi prioritas minggu berikutnya.

---

## 3. Hasil Proses Minggu Ini

1. Login UX kembali sesuai desain referensi.
2. Role-based redirect pasca-login selesai dan bisa dipakai demo.
3. Sidebar role filtering mengurangi noise menu per pengguna.
4. Fondasi state role siap dipakai middleware/proxy guard tahap berikutnya.

---

## 4. Kendala, Risiko, dan Mitigasi

**Kendala:**
1. State role berpotensi tidak sinkron saat pergantian penyimpanan session.
2. Perbedaan ekspektasi visual dengan desain referensi awal.

**Risiko:**
1. Jika state role tidak konsisten, route guard minggu berikutnya bisa menghasilkan redirect yang salah.

**Mitigasi:**
1. Penyeragaman key session.
2. Validasi ulang role saat mount komponen layout.
3. Regression test manual per role sebelum penutupan minggu.

---

## 5. Keputusan Minggu Ini

1. Menetapkan role sebagai sumber kebenaran utama untuk alur navigasi awal pengguna.
2. Menunda integrasi auth backend dan fokus pada stabilitas flow frontend terlebih dahulu.
3. Menjadikan route protection sebagai prioritas sprint minggu ke-3.

---

## 6. Action Minggu Berikutnya

| Action Item | PIC | Due Date |
|------------|-----|----------|
| Implementasi route guard server-side berbasis role | Frontend Web Admin | Minggu ke-3 |
| Menambahkan logout flow dengan konfirmasi | Frontend Web Admin | Minggu ke-3 |
| Menyelesaikan bug route dashboard kembali ke login | Frontend Web Admin | Minggu ke-3 |
| Menjalankan build regression setelah perubahan guard | Frontend Web Admin | Minggu ke-3 |

---

## 7. Rincian Teknis Implementasi

Bagian ini menuliskan detail engineering agar proses minggu ke-2 dapat ditelusuri kembali saat audit sprint:

1. Rincian Login UI Refactor:
	- Menyamakan kembali struktur visual form login dengan referensi yang disepakati.
	- Menjaga konsistensi elemen heading, input, helper text, dan CTA.
2. Rincian Role Mapping:
	- Menetapkan relasi tetap antara akun dev dan role kerja.
	- Menetapkan relasi tetap antara role dan route awal dashboard.
3. Rincian Session State:
	- Menyimpan data role/email untuk menjaga kontinuitas sesi.
	- Menyesuaikan mekanisme pembacaan role agar konsisten saat halaman di-refresh.
4. Rincian Sidebar Filtering:
	- Menambahkan logika filter item menu berdasarkan role aktif.
	- Menjamin menu yang ditampilkan hanya menu yang relevan untuk role tersebut.

---

## 8. Matrix Pengujian Minggu Ini

| Skenario Uji | Metode | Hasil |
|--------------|--------|-------|
| Login akun admin | Manual browser | Pass |
| Login akun sales | Manual browser | Pass |
| Login akun finance | Manual browser | Pass |
| Redirect role ke dashboard sesuai mapping | Manual browser + route check | Pass |
| Sidebar menyesuaikan role saat login awal | Manual UI check | Pass |
| Sidebar tetap sesuai role setelah refresh | Manual UI check | Pass |

Catatan matrix:
1. Fokus pengujian minggu ini adalah validitas alur login-redirect-menu.
2. Pengujian terhadap route-level authorization belum masuk scope minggu ke-2.

---

## 9. Artefak Output Engineering

Artefak yang dihasilkan pada akhir minggu:

1. Halaman login versi revisi sesuai konsep visual.
2. Mapping akun dev ke role dan role ke dashboard.
3. Sidebar role-based menu filtering.
4. Catatan pengujian manual lintas role.

Artefak ini menjadi baseline penting untuk pekerjaan keamanan route minggu ke-3.

---

## 10. Lessons Learned Minggu Ini

Pelajaran teknis yang didapat selama sprint:

1. Menunda sinkronisasi state role hingga sprint berikutnya berisiko memperbesar biaya refactor guard.
2. Konsistensi key session sangat krusial ketika satu data digunakan lintas komponen login dan layout.
3. Menutup deviasi desain lebih awal membuat feedback user berkurang pada sprint berikutnya.
4. Pengujian lintas role harus dilakukan sejak awal walaupun fitur keamanan route belum selesai.

---

## 11. Cuplikan Source Code Penting Minggu Ini

### A. Mapping Akun Dev ke Role dan Redirect Dashboard

File: `frontend/web-admin/src/app/(auth)/login/page.tsx`

```tsx
type UserRole = "admin" | "inventory" | "sales" | "finance" | "legal" | "supervisor";

const DEV_ACCOUNTS = [
	{ label: "Admin / Direktur", email: "admin@simdp.dev", password: "Admin@123", role: "admin" as UserRole, redirectTo: "/dashboard/admin" },
	{ label: "Admin Inventory", email: "inventory@simdp.dev", password: "Inventory@123", role: "inventory" as UserRole, redirectTo: "/dashboard/inventory" },
	{ label: "Sales & Marketing", email: "sales@simdp.dev", password: "Sales@123", role: "sales" as UserRole, redirectTo: "/dashboard/sales" },
	{ label: "Finance & Accounting", email: "finance@simdp.dev", password: "Finance@123", role: "finance" as UserRole, redirectTo: "/dashboard/finance" },
	{ label: "Tim Legal", email: "legal@simdp.dev", password: "Legal@123", role: "legal" as UserRole, redirectTo: "/dashboard/legal" },
	{ label: "Pengawas Lapangan", email: "supervisor@simdp.dev", password: "Supervisor@123", role: "supervisor" as UserRole, redirectTo: "/dashboard/supervisor" },
];
```

Penjelasan singkat:
1. Snippet ini adalah inti dari alur direct login per role.
2. Redirect role didefinisikan eksplisit agar konsisten saat pengujian lintas akun.

### B. Penyimpanan Session Role dan Redirect Pasca Login

File: `frontend/web-admin/src/app/(auth)/login/page.tsx`

```tsx
const getRoleRedirect = (emailValue: string) => {
	const account = getAccountByEmail(emailValue);
	return account?.redirectTo ?? DEFAULT_REDIRECT;
};

const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
	event.preventDefault();
	const matchedAccount = getAccountByEmail(email);
	const resolvedRole: UserRole = matchedAccount?.role ?? DEFAULT_ROLE;
	const targetRoute = getRoleRedirect(email);

	const authPayload = JSON.stringify({
		email: email.trim(),
		role: resolvedRole,
		redirectTo: targetRoute,
		loginAt: Date.now(),
	});

	if (rememberSession) {
		localStorage.setItem("simdp_auth", authPayload);
		sessionStorage.removeItem("simdp_auth");
	} else {
		sessionStorage.setItem("simdp_auth", authPayload);
		localStorage.removeItem("simdp_auth");
	}

	router.push(targetRoute);
};
```

Penjelasan singkat:
1. Session role disimpan agar aplikasi tahu konteks user saat reload.
2. Route tujuan ditentukan sebelum push, sehingga transisi login lebih deterministik.

### C. Filtering Sidebar Berdasarkan Role Aktif

File: `frontend/web-admin/src/components/layout/sidebar.tsx`

```tsx
const filteredMenuItems = useMemo(() => {
	if (currentRole === "guest") {
		return [] as MenuGroup[];
	}

	return menuItems
		.map((group) => {
			const items = group.items
				.filter((item) => item.roles.includes(currentRole))
				.map((item) => ({
					...item,
					href: item.label === "Dashboard" ? ROLE_HOME[currentRole] : item.href,
					children: item.children?.filter((child) => child.roles.includes(currentRole)),
				}));

			return { ...group, items };
		})
		.filter((group) => group.items.length > 0);
}, [currentRole]);
```

Penjelasan singkat:
1. Ini adalah bagian kunci pembatasan menu level UI minggu ke-2.
2. Logika yang sama nanti menjadi dasar harmonisasi dengan route guard minggu ke-3.

---

**Catatan:** Dokumen ini hanya memuat proses yang benar-benar sudah terjadi pada minggu ke-2.