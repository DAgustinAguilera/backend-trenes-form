const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const Data_Base = require("./models/db");
const Reporte = require("./models/reporteModel");
const cors = require("cors");
const reporteModel = require("./models/reporteModel");
const passport = require("./auth/auth");
const generateJWT = require("./helpers/generateJWT");

app.use(express.json());
app.use(cors());


app.use(
  require("express-session")({
    secret: process.env.SECRET_WEB_TOKEN,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/db", async (req, res) => {
  try {
    const workers = await Data_Base.find();
    res.status(200).json({ data: workers });
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, error });
  }
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
    function(req, res) {
      const {_id, firstname, lastname, email, pictureUrl} = req.user
      const userData = {
        sub: _id,
        firstname,
        lastname,
        email,
        pictureUrl
      }
      console.log(userData)
      const jwt = generateJWT(userData)
      const login_info = JSON.stringify({jwt, user: req.user})

      res.redirect(`http://localhost:5173/?login_info=${login_info}`);
    });

app.get("/reportes", passport.authenticate("jwt", {session: false}) ,async (req, res) => {
    try {
      const reportes = await Reporte.find();
      res.status(200).json({ data: reportes });
    } catch (error) {
      console.log(error);
      res.status(400).json({ ok: false, error });
    }
  });

  app.delete('/reporte/:id',passport.authenticate("jwt", {session: false}) , async (req, res) => {
    const { id } = req.params;
  
    try {
      // Actualiza el documento con el id especificado, estableciendo estado en false
      const result = await Reporte.updateOne({ _id: id }, { $set: { estado: false } });
  
      // Comprueba si se actualizó algún documento
      if (result.nModified >= 0) {
        res.status(200).json({ ok: true, message: "Reporte marcado como inactivo" });
      } else {
        res.status(404).json({ ok: false, message: "Reporte no encontrado" });
      }
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
        observaciones:reporte.observaciones,
        estado:reporte.estado
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
