const express = require("express");
const { json } = require("body-parser");
const serverless = require("serverless-http");
const cors = require("cors");

// Pastikan dotenv hanya dipanggil sekali dan di awal
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
app.use(cors());
app.use(json());

// Pastikan path ke file routes sudah benar relatif terhadap index.js
// Jika folder 'routes' berada di root (satu tingkat di atas 'api'), gunakan '../routes/'
// Jika folder 'routes' berada di dalam 'api' (misalnya 'api/routes/'), gunakan './routes/'
const konsultasiRoute = require("../routes/konsultasi");
const registrasiRoute = require("../routes/registrasi");

app.use("/api/form/konsultasi", konsultasiRoute);
app.use("/api/form/registrasi", registrasiRoute);

// Export handler untuk Vercel Serverless Function
module.exports.handler = serverless(app);

// Tambahkan ini untuk menjalankan server secara lokal
// Ini hanya akan berjalan jika file ini dieksekusi langsung (misalnya dengan `node api/index.js`)
// dan tidak saat diimpor sebagai modul oleh serverless-http di Vercel.
if (require.main === module) {
  const PORT = process.env.PORT || 3000; // Gunakan port dari .env atau default 3000
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}
