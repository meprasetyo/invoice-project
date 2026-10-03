# Invoice Generator

Aplikasi full-stack untuk membuat dan mengelola invoice, dibangun dengan **Next.js 14**, **PostgreSQL**, **Drizzle ORM**, dan **shadcn/ui**.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend & Backend | Next.js 14 (App Router) |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| UI Components | shadcn/ui (New York style) |
| Form Validation | React Hook Form + Zod |
| State Management | Jotai |
| Styling | Tailwind CSS |

---

## Fitur

### Fitur Wajib
- **Daftar Invoice** — tabel dengan kolom Invoice #, Client Name, Issue Date, Due Date, Total Amount, Status, dan tombol View Details
- **Buat Invoice** — form dengan data klien, tanggal, dan item dinamis (add/remove row)
- **Detail Invoice** — tampilan lengkap semua informasi invoice beserta tabel item
- **Ubah Status** — Draft → Sent → Paid / Cancelled dari halaman detail
- **Hapus Invoice** — dengan konfirmasi dialog sebelum hapus

### Fitur Bonus (Poin Plus)
- ✅ **Export ke PDF** — tombol Print / PDF di halaman detail invoice menggunakan `window.print()` dengan `@media print` CSS yang sudah dioptimalkan. Navigasi dan tombol-tombol disembunyikan otomatis saat print, sehingga yang tercetak hanya invoice-nya saja. Bisa langsung Save as PDF dari dialog print browser.
- ✅ **Validasi Formulir Tingkat Lanjut** — validasi menggunakan **Zod schema** (`dtos/invoice.dto.ts`) dikombinasikan dengan **React Hook Form** (`useFieldArray`, `zodResolver`). Validasi mencakup: field wajib, quantity minimal 1, unit price > 0, minimal 1 item, dan pesan error per-field yang informatif langsung di bawah input.
- ✅ **Paginasi & Pencarian** — halaman list invoice dilengkapi search bar (cari by invoice number atau client name) dan pagination dengan tombol prev/next. Query search dan page disimpan di URL params sehingga bisa di-bookmark / di-share.
- ✅ **Error Handling Robust** — setiap Server Action mengembalikan `{ success: true, data }` atau `{ success: false, error: string }`. Di frontend, error ditangkap dan ditampilkan ke pengguna. Di backend, service layer melempar error deskriptif (misal: "Invoice not found") yang diteruskan ke client.
- ✅ **Notifikasi Toast** — menggunakan komponen **Toaster dari shadcn/ui**. Muncul otomatis setelah: berhasil/gagal membuat invoice, berhasil/gagal mengubah status, berhasil/gagal menghapus invoice.

---

## Prerequisites

Pastikan sudah terinstall di komputer:

- [Node.js](https://nodejs.org/) v18 atau lebih baru
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/) (lokal atau remote)
- npm v9 atau lebih baru (sudah include dengan Node.js)

---

## Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/meprasetyo/invoice-project.git
cd invoice-project
```

---

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` diperlukan karena beberapa package memiliki peer dependency yang konflik di React 19.

Jika SWC binary gagal / corrupt setelah install, jalankan:

```bash
npm install @next/swc-win32-x64-msvc@14.2.3 --legacy-peer-deps
```

---

### 3. Konfigurasi Environment

Buat file `.env.local` di root project:

```bash
cp .env.dev .env.local
```

Edit `.env.local` sesuai koneksi PostgreSQL kamu:

```env
DATABASE_URL=postgres://postgres:PASSWORD@localhost:5432/invoice_db
```

Ganti:
- `postgres` → username PostgreSQL kamu
- `PASSWORD` → password PostgreSQL kamu
- `localhost` → host server PostgreSQL (default: localhost)
- `5432` → port PostgreSQL (default: 5432)
- `invoice_db` → nama database yang akan dipakai

> File `.env.local` juga perlu di-copy ke `.env` agar Drizzle Kit bisa membacanya:
> ```bash
> copy .env.local .env
> ```

---

### 4. Buat Database

Buat database `invoice_db` di PostgreSQL. Bisa lewat:

**Opsi A — PowerShell (Windows, jika psql ada di PATH):**
```powershell
$env:PGPASSWORD = "PASSWORD"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -c "CREATE DATABASE invoice_db;"
```

**Opsi B — Navicat / pgAdmin:**
1. Buka koneksi PostgreSQL
2. Klik **New Query**
3. Jalankan:
```sql
CREATE DATABASE invoice_db;
```

**Opsi C — Terminal Linux/Mac:**
```bash
psql -U postgres -h localhost -c "CREATE DATABASE invoice_db;"
```

---

### 5. Push Schema ke Database

Perintah ini otomatis membuat semua tabel yang dibutuhkan (`invoices`, `invoice_items`) berdasarkan schema Drizzle:

```bash
npm run db:push
```

Output yang diharapkan:
```
✓ Pulling schema from database...
✓ Changes applied
```

---

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka browser dan akses: **http://localhost:3000**

---

## Scripts

| Command | Fungsi |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan production server (setelah build) |
| `npm run lint` | Jalankan ESLint |
| `npm run db:push` | Sync schema Drizzle ke database |
| `npm run db:studio` | Buka Drizzle Studio (GUI database) |

---

## Build untuk Production

```bash
# 1. Build aplikasi
npm run build

# 2. Jalankan production server
npm run start
```

---

## Struktur Project

```
boilerplate-nextjs/
├── app/
│   ├── layout.tsx                        # Root layout (providers, theme)
│   ├── globals.css                       # Global CSS + print styles
│   └── (main)/
│       ├── layout.tsx                    # Main layout + Navbar
│       ├── page.tsx                      # Halaman list invoice (/)
│       ├── _components/
│       │   └── invoice-table.tsx         # Tabel invoice + search + pagination
│       ├── new-invoice/
│       │   ├── page.tsx                  # Halaman buat invoice (/new-invoice)
│       │   └── _components/
│       │       └── create-invoice-form.tsx  # Form dinamis dengan item
│       └── invoices/[id]/
│           ├── page.tsx                  # Halaman detail invoice
│           ├── not-found.tsx             # Halaman 404
│           └── _components/
│               ├── invoice-actions.tsx   # Dropdown ubah status & hapus
│               └── print-button.tsx     # Tombol print/PDF
│
├── actions/
│   └── invoice.action.ts                # Next.js Server Actions
│
├── services/
│   └── invoice.service.ts               # Business logic layer
│
├── repositories/
│   └── invoice.repository.ts            # Database query layer (Drizzle)
│
├── drizzle/
│   ├── schema.ts                        # Definisi tabel database
│   ├── relations.ts                     # Relasi antar tabel
│   └── 0001_invoice_tables.sql          # Migration SQL manual (opsional)
│
├── dtos/
│   └── invoice.dto.ts                   # Zod schemas & TypeScript types
│
├── entity/
│   └── Invoice.ts                       # Domain entity interfaces
│
├── hooks/
│   └── use-invoice-form.ts              # Custom React Hook form invoice
│
├── atoms/
│   └── invoice.atom.ts                  # Jotai global state atoms
│
├── components/
│   ├── navbar.tsx                       # Navigasi atas
│   ├── invoice-status-badge.tsx         # Badge status invoice
│   └── ui/                             # shadcn/ui components
│
├── lib/
│   ├── db.ts                           # Drizzle client singleton
│   └── utils.tsx                       # cn() utility
│
├── .env.local                          # Environment variables (tidak di-commit)
├── drizzle.config.ts                   # Konfigurasi Drizzle Kit
├── next.config.mjs                     # Konfigurasi Next.js
├── tailwind.config.ts                  # Konfigurasi Tailwind CSS
└── tsconfig.json                       # Konfigurasi TypeScript
```

---

## Arsitektur

Project mengikuti **layered architecture**:

```
Client Component (UI)
  └─▶ Custom Hook (useInvoiceForm)
        └─▶ Server Action (createInvoiceAction)
              └─▶ Service (InvoiceService)
                    └─▶ Repository (InvoiceRepository)
                          └─▶ Drizzle ORM
                                └─▶ PostgreSQL
```

---

## Troubleshooting

### SWC binary error saat `npm run dev`
```
Failed to load SWC binary for win32/x64
```
**Fix:**
```bash
npm install @next/swc-win32-x64-msvc@14.2.3 --legacy-peer-deps
```

### drizzle-kit push error: `Transforming const to es5`
**Fix:** Pastikan `tsconfig.json` menggunakan `"target": "ES2020"` bukan `"es5"`.

### drizzle-kit push error: `Either connection url or host are required`
**Fix:** Pastikan file `.env` (bukan hanya `.env.local`) ada dan berisi `DATABASE_URL`:
```bash
copy .env.local .env
```

### Google Fonts timeout saat kompilasi
Terjadi jika tidak ada koneksi internet. Tidak mempengaruhi fungsionalitas app.

---

## Tantangan & Solusi

- **SWC corrupt** — SWC binary tidak terdownload dengan benar saat `npm install --legacy-peer-deps`. Solusi: install manual `@next/swc-win32-x64-msvc` dengan versi yang sesuai Next.js.
- **drizzle-kit + tsconfig es5** — drizzle-kit pakai esbuild untuk baca schema, dan esbuild tidak bisa transpile ke es5. Solusi: ubah `target` di `tsconfig.json` ke `ES2020`.
- **PDF Export** — Menggunakan `window.print()` dengan `@media print` CSS untuk menyembunyikan navigasi dan format invoice agar siap cetak / save as PDF, tanpa dependency tambahan.
- **Real-time totals** — Menggunakan `form.watch('items')` dari React Hook Form untuk kalkulasi subtotal dan grand total di setiap perubahan input tanpa submit form.
- **Dynamic item rows** — Implementasi dengan `useFieldArray` dari React Hook Form, terhubung penuh dengan validasi Zod.

---

## Lisensi

ISC
