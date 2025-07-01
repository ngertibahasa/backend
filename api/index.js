const express = require("express");
const { json } = require("body-parser");
const serverless = require("serverless-http");
const cors = require("cors");

console.log("Memulai aplikasi Express...");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  console.log("dotenv dimuat di lingkungan non-produksi.");
} else {
  console.log("Lingkungan produksi, variabel lingkungan dari Vercel.");
}

const app = express();
app.use(cors());
app.use(json());

console.log("Mengatur rute...");
const konsultasiRoute = require("../routes/konsultasi");
const registrasiRoute = require("../routes/registrasi");

app.use("/api/form/konsultasi", konsultasiRoute);
app.use("/api/form/registrasi", registrasiRoute);

console.log("Handler serverless siap.");
module.exports = serverless(app);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}
