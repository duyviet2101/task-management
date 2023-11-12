const Task = require('../models/task.model.js');

const paginationHelper = require('../../../helpers/pagination.js')
const searchHelper = require('../../../helpers/search.js')

// GET /api/v1/tasks
module.exports.index =  async (req, res) => {
  const find = {
    deleted: false
  }

  if (req.query.status) {
    find.status = req.query.status
  }

  let objectSearch = searchHelper(req.query)
  if (req.query.keyword) {
    find.title = objectSearch.regex
  }
  //? pagination
  const initPagination = {
    currentPage: 1,
    limitItems: 2
  }
  const countTask = await Task.countDocuments(find)
  const objectPagination = paginationHelper(
    initPagination,
    req.query,
    countTask
  )
  //? end pagination

  //?sort
  const sort = {}
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  }
  //? end sort

  const tasks = await Task.find(find)
    .sort(sort)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItems)

  res.json(tasks)
}

// GET /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id

    const task = await Task.findOne({
      _id: id,
      deleted: false 
    })
    
    res.json(task)
  } catch (error) {
    res.json(error)
  }
}