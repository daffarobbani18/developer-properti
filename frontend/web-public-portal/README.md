# Web Public + Portal Customer

Website gabungan untuk 2 area:

1. Area Publik (tanpa login)
- Route utama: `/`, `/tipe-rumah`, `/galeri`, `/simulasi-kpr`, `/kontak`

2. Area Portal Customer (wajib login)
- Prefix route: `/portal/*`
- Contoh: `/portal/login`, `/portal/progres`, `/portal/tagihan`, `/portal/dokumen`

Tujuan:
- Marketing publik dan portal customer tetap satu website/codabase
- Tetap dipisahkan jelas secara route dan hak akses
