const { google } = require("googleapis");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Permintaan POST diterima di /api/form/konsultasi");
  console.log("Body permintaan:", req.body); // Log body yang diterima

  try {
    // Validasi input awal
    const { nama, usia, program } = req.body;
    if (!nama || !usia || !program) {
      console.warn("Validasi gagal: Data konsultasi tidak lengkap.");
      return res
        .status(400)
        .json({
          message:
            "Data tidak lengkap. Harap isi semua field (nama, usia, program).",
        });
    }

    // Inisialisasi Google APIs di dalam handler (saat request datang)
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, "base64").toString(
        "utf-8"
      )
    );

    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
    const SHEET_NAME = "Konsultasi";

    // Pastikan SPREADSHEET_ID ada
    if (!SPREADSHEET_ID) {
      console.error("SPREADSHEET_ID tidak ditemukan di environment variables.");
      return res
        .status(500)
        .json({
          message:
            "Konfigurasi server tidak lengkap: SPREADSHEET_ID tidak ada.",
        });
    }

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:C`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[nama, usia, program]],
      },
    });

    console.log("Data konsultasi berhasil dikirim ke Google Sheets.");
    res.status(200).send("Data konsultasi berhasil dikirim!");
  } catch (error) {
    console.error("Terjadi error di rute konsultasi:", error.stack); // Log error stack trace
    // Periksa apakah error terkait kredensial atau API Google
    if (error.code === 401 || error.code === 403) {
      res
        .status(401)
        .json({
          message: "Autentikasi Google Sheets gagal. Periksa kredensial.",
          error: error.message,
        });
    } else if (error.message.includes("credentials")) {
      res
        .status(500)
        .json({
          message:
            "Gagal memuat kredensial Google. Pastikan GOOGLE_CREDENTIALS_BASE64 benar.",
          error: error.message,
        });
    } else {
      res
        .status(500)
        .json({
          message: "Gagal mengirim data konsultasi.",
          error: error.message,
        });
    }
  }
});

module.exports = router;
