const express = require('express')
const database = require('./config/database.js')
require('dotenv').config()

const routesApiVer1 = require('./api/v1/routes/index.route.js')

const app = express()
const port = process.env.PORT || 3000

database.connect();

// Routes V1
routesApiVer1(app)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})