const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const Data_Base = require("./models/db");
const Reporte = require("./models/reporteModel");
const cors = require("cors");
const reporteModel = require("./models/reporteModel");
app.use(express.json());
app.use(cors());

app.get("/db", async (req, res) => {
  try {
    const workers = await Data_Base.find();
    res.status(200).json({ data: workers });
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, error });
  }
});

app.get("/reportes", async (req, res) => {
    try {
      const reportes = await Reporte.find();
      res.status(200).json({ data: reportes });
    } catch (error) {
      console.log(error);
      res.status(400).json({ ok: false, error });
    }
  });

app.post("/reporte", async (req, res) => {
  try {
    const reporte = await req.body;
    res.status(200).json({ ok: true, message: "reporte recibido" });
    console.log(reporte);
    await Reporte.create([
      {
        servicio:reporte.servicio,
        locomotora:reporte.locomotora,
        siendo:reporte.siendo,
        nombre:reporte.nombre,
        guarda:reporte.guarda,
        con:reporte.con,
        art:reporte.art,
        dia:reporte.dia,
        observaciones:reporte.observaciones
      },
    ]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, error });
  }
});

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((err) => {
    console.error("Error conectando a la base de datos", err);
  });

app.listen(PORT, () => {
  console.log(`App escuchando en puerto ${PORT}`);
});
