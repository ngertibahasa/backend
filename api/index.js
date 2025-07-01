const express = require("express");
const { json } = require("body-parser");
const serverless = require("serverless-http");
const cors = require("cors");

console.log("Memulai aplikasi Express..."); // Log ini akan muncul di Vercel logs

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  console.log("dotenv dimuat di lingkungan non-produksi.");
} else {
  console.log("Lingkungan produksi, variabel lingkungan dari Vercel.");
}

const app = express();
app.use(cors());
app.use(json());

// Tambahkan rute dasar untuk pengujian awal
app.get("/", (req, res) => {
  console.log("Permintaan GET ke / diterima."); // Log ini akan muncul
  res.status(200).send("API Express berhasil berjalan di Vercel!");
});

console.log("Mengatur rute..."); // Log ini akan muncul
try {
  // Pastikan path ke file routes sudah benar relatif terhadap index.js
  // Jika folder 'routes' berada di root (satu tingkat di atas 'api'), gunakan '../routes/'
  // Jika folder 'routes' berada di dalam 'api' (misalnya 'api/routes/'), gunakan './routes/'
  const konsultasiRoute = require("../routes/konsultasi");
  const registrasiRoute = require("../routes/registrasi");
  app.use("/api/form/konsultasi", konsultasiRoute);
  app.use("/api/form/registrasi", registrasiRoute);
  console.log("Rute konsultasi dan registrasi berhasil dimuat.");
} catch (error) {
  console.error("Gagal memuat rute:", error.message); // Log error jika gagal memuat rute
  // Penting: Jangan biarkan aplikasi crash di sini, lanjutkan saja.
}

console.log("Handler serverless siap."); // Log ini akan muncul

// PERBAIKAN PENTING: Export langsung serverless(app)
module.exports = serverless(app);

// Tambahkan ini untuk menjalankan server secara lokal
// Ini hanya akan berjalan jika file ini dieksekusi langsung (misalnya dengan `node api/index.js`)
// dan tidak saat diimpor sebagai modul oleh serverless-http di Vercel.
if (require.main === module) {
  const PORT = process.env.PORT || 3000; // Gunakan port dari .env atau default 3000
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}
