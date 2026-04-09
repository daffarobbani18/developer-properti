# App Routes Structure

- `(public)/(pages)` : halaman publik (marketing)
- `portal/*`         : halaman customer terproteksi

Catatan:
- Middleware auth untuk route `/portal/*`
- Data publik baca unit dengan status real-time
- Data portal dibatasi ownership per customer
