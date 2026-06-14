# Diagram Alur Kerja Sistem (Mermaid)

Berikut adalah diagram alur kerja terperinci yang menggambarkan perjalanan sebuah properti, dari lahan kosong hingga kunci diserahkan ke tangan pembeli. Diagram ini memuat semua jalur paralel divisi (Keuangan, Legal, dan Pembangunan) beserta titik-titik keputusan (cabang) dengan bahasa yang mudah dipahami.

```mermaid
flowchart TD
    %% WARNA DAN STYLE UNTUK DIVISI
    classDef inventory fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0f172a
    classDef sales fill:#fef08a,stroke:#ca8a04,stroke-width:2px,color:#0f172a
    classDef finance fill:#dcfce3,stroke:#16a34a,stroke-width:2px,color:#0f172a
    classDef legal fill:#fce7f3,stroke:#db2777,stroke-width:2px,color:#0f172a
    classDef build fill:#ffedd5,stroke:#ea580c,stroke-width:2px,color:#0f172a
    classDef customer fill:#f3f4f6,stroke:#4b5563,stroke-width:2px,stroke-dasharray: 5 5,color:#0f172a
    classDef milestone fill:#1e293b,stroke:#cbd5e1,stroke-width:3px,color:#ffffff
    classDef decision fill:#ffffff,stroke:#64748b,stroke-width:2px,stroke-dasharray: 5 5,color:#0f172a

    %% FASE 1: PERSIAPAN GUDANG / INVENTORY
    subgraph Fase_1 [FASE 1: PERSIAPAN BARANG]
        direction TB
        A1["Admin Inventory: Membuat Data Proyek Baru"]:::inventory
        A2["Membuat Tipe Rumah/Kavling & Menentukan Harga"]:::inventory
        A3["Memecah Menjadi Unit/Blok Rumah"]:::inventory
        A4(("STATUS: UNIT TERSEDIA")):::milestone

        A1 --> A2 --> A3 --> A4
    end

    %% FASE 2: MARKETING & PENJUALAN
    subgraph Fase_2 [FASE 2: PROSES PENJUALAN]
        direction TB
        B1["Konsumen Bertanya & Cek Lokasi"]:::customer
        B2["Sales Mencatat Data Lead/Prospek"]:::sales
        B3{"Apakah Konsumen Jadi Beli?"}:::decision
        
        B4["Sales Membuat Form Booking Unit"]:::sales
        B5(("STATUS: UNIT BOOKED")):::milestone

        A4 --> B1
        B1 --> B2 --> B3
        B3 -- Ya, Lanjut Bayar Tanda Jadi --> B4
        B3 -- Tidak / Batal --> A4
        B4 --> B5
    end

    %% FASE 3: VALIDASI & PARALEL
    subgraph Fase_3 [FASE 3: PEMBAYARAN, LEGAL & PEMBANGUNAN PARALEL]
        direction TB
        
        C1["Finance: Menunggu Transfer Uang Tanda Jadi/DP"]:::finance
        C2{"Transfer Masuk?"}:::decision
        
        C3["Finance: Approve Booking"]:::finance
        C4(("STATUS: UNIT TERJUAL!")):::milestone
        
        B5 --> C1
        C1 --> C2
        C2 -- Belum/Batal Bayar --> A4
        C2 -- Uang Sudah Masuk --> C3 --> C4

        %% CABANG PARALEL SETELAH TERJUAL
        C4 -->|JALUR KEUANGAN| F1
        C4 -->|JALUR LEGALITAS| L1
        C4 -->|JALUR LAPANGAN| K1

        %% ALUR KEUANGAN (FINANCE)
        subgraph Finance_Flow [Jalur Keuangan]
            direction TB
            F1["Finance: Menerbitkan Tagihan Cicilan DP / KPR"]:::finance
            F2["Konsumen Membayar Tagihan Per Bulan"]:::customer
            F3{"Apakah Lunas 100%?"}:::decision
            F4["Keuangan: Mengubah Status Pembayaran Jadi Lunas"]:::finance
            
            F1 --> F2 --> F3
            F3 -- Belum Lunas --> F1
            F3 -- Ya, Lunas --> F4
        end

        %% ALUR LEGALITAS (LEGAL)
        subgraph Legal_Flow [Jalur Dokumen Legal]
            direction TB
            L1["Legal: Menyusun Berkas Konsumen & PPJB"]:::legal
            L2{"Metode Bayar?"}:::decision
            L3["KPR: Menunggu Akad Kredit & SP3K Bank"]:::legal
            L4["Cash: Langsung Urus Pecah Sertifikat & AJB"]:::legal
            L5["Legal: Dokumen Balik Nama / SHM Selesai"]:::legal

            L1 --> L2
            L2 -- KPR --> L3 --> L5
            L2 -- Cash Keras/Bertahap --> L4 --> L5
        end

        %% ALUR KONSTRUKSI (PEMBANGUNAN)
        subgraph Build_Flow [Jalur Konstruksi & Fisik]
            direction TB
            K1["Tim Lapangan: Memulai Pembangunan Fisik"]:::build
            K2["Update Progress: Misal Pondasi, Dinding, Atap"]:::build
            K3{"Progress 100%?"}:::decision
            K4["Pengawas Lapangan: Inspeksi Defect/Cacat Bangunan"]:::build
            K5{"Ada Cacat Bangunan?"}:::decision
            K6["Tukang: Perbaiki Cacat Sampai Status Selesai"]:::build
            K7["Fisik Rumah 100% Sempurna & Siap Huni"]:::build

            K1 --> K2 --> K3
            K3 -- Belum --> K2
            K3 -- Sudah 100% --> K4 --> K5
            K5 -- Ya, Ada Komplain --> K6 --> K4
            K5 -- Tidak, Semua Mulus --> K7
        end
    end

    %% FASE 4: SERAH TERIMA / BAST
    subgraph Fase_4 [FASE 4: SERAH TERIMA KUNCI / BAST]
        direction TB
        
        %% KETIGA SYARAT HARUS TERPENUHI
        D1{"Cek 3 Syarat Utama"}:::decision
        D2("1. Uang Lunas & 2. Dokumen Beres & 3. Fisik 100% Sempurna"):::milestone
        
        F4 --> D1
        L5 --> D1
        K7 --> D1
        
        D1 --> D2
        
        D3["Legal: Menerbitkan Jadwal Serah Terima"]:::legal
        D4["Konsumen Menerima Kunci Rumah Baru"]:::customer
        D5(("STATUS: SELESAI / BAST")):::milestone

        D2 --> D3 --> D4 --> D5
    end
```

## Penjelasan Singkat Warna & Peran:
- <span style="color:#0284c7">🟦 **Biru (Inventory)**</span>: Memastikan ada rumah yang siap untuk dijual.
- <span style="color:#ca8a04">🟨 **Kuning (Sales)**</span>: Ujung tombak berhadapan dengan pelanggan untuk *booking*.
- <span style="color:#16a34a">🟩 **Hijau (Keuangan)**</span>: Urat nadi yang mengendalikan dan memvalidasi uang masuk. *Booking* tidak akan sah sampai uang masuk.
- <span style="color:#db2777">🟪 **Merah Muda (Legal)**</span>: Mengurusi tumpukan kertas, dari Perjanjian, Bank (KPR), sampai Sertifikat Hak Milik.
- <span style="color:#ea580c">🟧 **Oranye (Pembangunan)**</span>: Orang lapangan yang menyusun bata, serta mengecek agar tidak ada cacat (*defect*) pada rumah.
- ⬛ **Hitam (Milestone Utama)**: Titik-titik paling penting di mana status rumah berubah di sistem.
