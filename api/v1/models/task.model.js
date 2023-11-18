const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
  title: String,
  status: String,
  content: String,
  timeStart: Date,
  timeFinish: Date,
  listUser: Array,
  taskParentId: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  createdBy: String
})

const Task = mongoose.model('Task', taskSchema, 'tasks')

module.exports = Task;