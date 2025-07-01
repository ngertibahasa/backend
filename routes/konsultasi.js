require("dotenv").config();
const { google } = require("googleapis");
const express = require("express");
const router = express.Router();

const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, "base64").toString("utf-8")
);

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "Konsultasi"; // untuk konsultasi

router.post("/", async (req, res) => {
  const { nama, usia, program } = req.body;

  try {
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

    res.status(200).send("Data konsultasi berhasil dikirim!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal mengirim data konsultasi.");
  }
});

module.exports = router;
