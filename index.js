const express = require('express')
const app = express()
const dotenv = require("dotenv").config()
const PORT = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello Worldd!')
})

app.listen(PORT, () => {
  console.log(`App escuchando en puerto ${PORT}`)
})