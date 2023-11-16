const express = require('express')
const database = require('./config/database.js')
require('dotenv').config()
const cors = require('cors')

const routesApiVer1 = require('./api/v1/routes/index.route.js')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

database.connect();

//? config bodyparse
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes V1
routesApiVer1(app)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})