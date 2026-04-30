const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'mahasiswa.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify({ mahasiswa: [] }, null, 2));
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function nextId(list) {
  return list.length === 0 ? 1 : Math.max(...list.map(m => m.id)) + 1;
}

// READ ALL — JSON endpoint untuk DataTables
app.get('/api/mahasiswa', (req, res) => {
  const db = readData();
  res.json({ data: db.mahasiswa });
});

// READ ONE
app.get('/api/mahasiswa/:id', (req, res) => {
  const db = readData();
  const item = db.mahasiswa.find(m => m.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Data tidak ditemukan' });
  res.json(item);
});

// CREATE
app.post('/api/mahasiswa', (req, res) => {
  const { nim, nama, jurusan, angkatan, email } = req.body;
  if (!nim || !nama || !jurusan || !angkatan || !email) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }
  const db = readData();
  const baru = {
    id: nextId(db.mahasiswa),
    nim, nama, jurusan,
    angkatan: parseInt(angkatan),
    email,
    createdAt: new Date().toISOString()
  };
  db.mahasiswa.push(baru);
  writeData(db);
  res.status(201).json({ message: 'Data berhasil ditambahkan', data: baru });
});

// UPDATE
app.put('/api/mahasiswa/:id', (req, res) => {
  const db = readData();
  const idx = db.mahasiswa.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Data tidak ditemukan' });

  const { nim, nama, jurusan, angkatan, email } = req.body;
  db.mahasiswa[idx] = {
    ...db.mahasiswa[idx],
    nim, nama, jurusan,
    angkatan: parseInt(angkatan),
    email,
    updatedAt: new Date().toISOString()
  };
  writeData(db);
  res.json({ message: 'Data berhasil diperbarui', data: db.mahasiswa[idx] });
});

// DELETE
app.delete('/api/mahasiswa/:id', (req, res) => {
  const db = readData();
  const idx = db.mahasiswa.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Data tidak ditemukan' });
  const dihapus = db.mahasiswa.splice(idx, 1);
  writeData(db);
  res.json({ message: 'Data berhasil dihapus', data: dihapus[0] });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
