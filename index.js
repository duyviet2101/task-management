const express = require('express')
const database = require('./config/database.js')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

database.connect();

const Task = require('./models/task.model.js');

app.get('/task', async (req, res) => {
  const tasks = await Task.find({ deleted: false })
  res.json(tasks)
})

app.get('/task/detail/:id', async (req, res) => {
  const id = req.params.id

  const task = await Task.findOne({
    _id: id,
    deleted: false 
  })
  
  res.json(task)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})