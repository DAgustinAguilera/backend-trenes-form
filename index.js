const express = require('express')
const app = express()
const dotenv = require("dotenv").config()
const PORT = process.env.PORT
const mongoose = require('mongoose')
const Data_Base = require("./models/db")
const cors = require("cors")

app.use(cors())

app.get('/db', async (req, res) => {
    try {
        const workers = await Data_Base.find()
        res.status(200).json({data: workers})
    } catch (error) {
        console.log(error)
        res.status(400).json({ ok: false, error })
    }
})

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch((err) => {
        console.error('Error conectando a la base de datos', err);
    });

    app.listen(PORT, () => {
        console.log(`App escuchando en puerto ${PORT}`)
      })
