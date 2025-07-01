const express = require("express");
const { json } = require("body-parser");
const serverless = require("serverless-http");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(json());

const konsultasiRoute = require("../routes/konsultasi");
const registrasiRoute = require("../routes/registrasi");

app.use("/api/form/konsultasi", konsultasiRoute);
app.use("/api/form/registrasi", registrasiRoute);

module.exports.handler = serverless(app);
