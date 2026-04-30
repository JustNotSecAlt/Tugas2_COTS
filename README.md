# Aplikasi CRUD Mahasiswa - Praktikum ABP Pertemuan 2

Aplikasi web sederhana untuk mengelola data mahasiswa dengan fungsionalitas **CRUD** (Create, Read, Update, Delete).

## Teknologi

- **Backend:** Node.js + Express
- **Frontend:** Bootstrap 5, jQuery 3.7
- **Plugin jQuery:**
  - jQuery DataTables (menampilkan data JSON dalam tabel)
  - jQuery Validate (validasi form)
  - Select2 (dropdown jurusan)
- **Penyimpanan:** File JSON (`data/mahasiswa.json`)

## Struktur Halaman

1. **`/`** — Beranda
2. **`/data.html`** — Halaman Tabel (DataTables, Read & Delete)
3. **`/form.html`** — Halaman Form (Create & Update)

## Endpoint API (JSON)

| Method | Endpoint                | Fungsi             |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/mahasiswa`        | Ambil semua data   |
| GET    | `/api/mahasiswa/:id`    | Ambil 1 data       |
| POST   | `/api/mahasiswa`        | Tambah data        |
| PUT    | `/api/mahasiswa/:id`    | Perbarui data      |
| DELETE | `/api/mahasiswa/:id`    | Hapus data         |

## Menjalankan

```bash
npm install
npm start
```

Buka browser: <http://localhost:3000>

## Struktur Folder

```
Pertemuan2/
├── server.js              # Express server + REST API
├── package.json
├── data/
│   └── mahasiswa.json     # Penyimpanan data (JSON)
└── public/
    ├── index.html         # Beranda
    ├── data.html          # Halaman tabel
    ├── form.html          # Halaman form
    ├── css/style.css
    └── js/
        ├── data.js        # Logika DataTables + hapus
        └── form.js        # Logika form + validasi
```
