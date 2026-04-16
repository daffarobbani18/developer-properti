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

## 12. Kronologi Eksekusi Harian (Ringkas)

Dokumentasi kronologi ditambahkan agar progres minggu ke-2 dapat ditelusuri secara berurutan, terutama saat tim melakukan evaluasi penyebab bug pada alur login dan navigasi role.

### Hari 1 - Rekonsolidasi Kebutuhan Login dan Role

1. Menutup daftar kebutuhan minimum untuk login flow role-based.
2. Menentukan bahwa fokus minggu ini adalah UX login, role redirect, dan sidebar relevan.
3. Menetapkan data akun dev sebagai sumber uji lintas role.
4. Menentukan batasan bahwa backend auth real belum menjadi scope.

### Hari 2 - Rework Login UI dan Mapping Role

1. Menyesuaikan kembali tampilan login agar konsisten dengan referensi visual.
2. Menyusun relasi eksplisit akun -> role -> dashboard tujuan.
3. Menambahkan validasi dasar agar route redirect lebih deterministik.
4. Menyelaraskan copy/teks input agar alur masuk user lebih jelas.

### Hari 3 - Session State dan Redirect Flow

1. Menambahkan penyimpanan session role/email untuk persistensi state.
2. Menetapkan perilaku sesi (remember vs non-remember) secara konsisten.
3. Menutup potensi mismatch redirect saat refresh halaman.
4. Menguji alur login berulang untuk beberapa role berbeda.

### Hari 4 - Sidebar Role Filtering

1. Menambahkan filter item menu berdasarkan role aktif.
2. Menyesuaikan route dashboard default pada item menu utama.
3. Menjaga agar menu hanya menampilkan area kerja yang relevan.
4. Menyelesaikan perapian struktur agar mudah dipakai minggu berikutnya.

### Hari 5 - Regression Check dan Sprint Closure

1. Menjalankan uji manual lintas role untuk login-redirect-menu.
2. Menjalankan build check lokal untuk memastikan tidak ada error kompilasi.
3. Menutup catatan risiko untuk transisi ke route guard minggu ke-3.
4. Menyepakati keputusan sprint dengan fokus keamanan route pada pekan berikutnya.

---

## 13. Quality Gate dan Acceptance Criteria

### A. Functional Gate

1. User berhasil login menggunakan akun dev yang tersedia.
2. Setiap role diarahkan ke dashboard role yang benar.
3. Sidebar hanya menampilkan menu yang sesuai role aktif.
4. State role tetap terbaca setelah reload halaman.

### B. Technical Gate

1. Tidak ada error TypeScript baru akibat perubahan login/sidebar.
2. Session key yang dipakai login dan layout konsisten.
3. Role mapping terpusat dan tidak tersebar acak di banyak komponen.
4. Build lokal lulus sebagai syarat penutupan sprint.

### C. UX Gate

1. Tampilan login kembali sejalan dengan konsep visual referensi.
2. Alur input sampai redirect tidak menimbulkan kebingungan user.
3. Menu role-based tidak menampilkan opsi yang tidak relevan.
4. Pergantian role antar sesi tidak menimbulkan artefak tampilan.

---

## 14. Dampak Operasional Minggu Ini

1. Dampak ke Stabilitas Alur Masuk:
	- Tim memiliki alur login yang dapat diuji berulang dengan hasil konsisten.
	- Ini menurunkan risiko bug saat route guard diperkenalkan pada minggu berikutnya.
2. Dampak ke Produktivitas Tim:
	- Sidebar yang relevan per role mempercepat simulasi use-case internal.
	- Reviewer tidak perlu menelusuri menu yang tidak berkaitan saat demo.
3. Dampak ke Kualitas Integrasi Lanjutan:
	- State role yang stabil menjadi fondasi penting bagi pengamanan route server-side.
	- Biaya refactor di minggu berikutnya menjadi lebih rendah.

---

## 15. Handoff Sprint Minggu Ke-2

### A. Artefak yang Dihandoff

1. Login page hasil rework sesuai baseline visual.
2. Role mapping akun dev dan dashboard tujuan.
3. Sidebar filtering berbasis role aktif.
4. Catatan pengujian manual lintas role.

### B. Pengetahuan yang Diteruskan ke Minggu Ke-3

1. UI-level restriction belum cukup tanpa route-level guard.
2. Key session harus dipertahankan konsisten antar komponen.
3. Redirect root dan fallback unauthorized harus didesain sebagai satu paket.

### C. Checklist Penutupan

1. Scope minggu ke-2 selesai sesuai target.
2. Testing inti login-redirect-menu lulus.
3. Build lokal tervalidasi.
4. Prioritas minggu ke-3 telah disepakati.

---

## 16. Analisis Efektivitas Proses Minggu Ke-2

Analisis ini menilai efektivitas pendekatan sprint minggu ke-2 setelah fokus dipusatkan pada login flow dan role-based navigation.

1. Efektivitas fokus sprint tunggal:
	- Tinggi, karena tim berhasil menuntaskan alur login-redirect-menu tanpa scope creep.
	- Dampak langsung: fondasi akses user siap dinaikkan ke level route guard.
2. Efektivitas urutan implementasi:
	- Baik, karena perbaikan visual login dilakukan bersamaan dengan penataan state role.
	- Tim menghindari refactor ganda antara aspek UI dan state management.
3. Efektivitas pengujian lintas role:
	- Baik, skenario login/redirect/refresh sudah mencakup role utama.
	- Pengujian ini menurunkan risiko bug saat memasuki sprint guard.
4. Area yang masih perlu diperkuat:
	- Belum ada validasi route-level authorization pada minggu ini.
	- Checklist pengujian direct URL perlu dijadikan standar pada minggu ke-3.

---

## 17. Risk Register Transisi ke Minggu Ke-3

1. Risiko bypass akses melalui URL manual:
	- Dampak: user bisa mencoba masuk ke area role lain meski menu UI sudah dibatasi.
	- Strategi: implementasi guard route server-side sebagai prioritas utama.
2. Risiko ketidaksinkronan sumber role (cookie vs storage):
	- Dampak: redirect tidak konsisten, potensi loop routing.
	- Strategi: menetapkan sumber role utama dan fallback tunggal untuk redirect.
3. Risiko logout belum memutus akses sepenuhnya:
	- Dampak: session residual menimbulkan false authentication state.
	- Strategi: menambahkan cleanup lintas media penyimpanan dan verifikasi pasca-logout.
4. Risiko regresi setelah guard aktif:
	- Dampak: route valid ikut terblokir jika matrix akses tidak tepat.
	- Strategi: uji matrix lintas role dengan skenario allow/deny eksplisit.

---

## 18. Rencana Hardening Proses Minggu Ke-3

1. Menetapkan desain authorization matrix sebelum coding guard.
2. Menyatukan aturan redirect root, unauthorized fallback, dan role home dalam satu keputusan arsitektur.
3. Menambahkan regression checklist khusus akses URL manual.
4. Menutup task logout flow bersamaan dengan implementasi guard agar session lifecycle konsisten.
5. Menyiapkan bukti pengujian terstruktur untuk mempermudah review lintas tim.

---

**Catatan:** Dokumen ini hanya memuat proses yang benar-benar sudah terjadi pada minggu ke-2.
