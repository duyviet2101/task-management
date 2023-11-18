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

// PATCH /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id

    const task = await Task.findOneAndUpdate({
      _id: id,
      deleted: false 
    }, {
      status: req.body.status
    }, {
      new: true
    })

    if (task) {
      res.json({
        code: 200,
        message: "Cập nhật trạng thái thành công!"
      })
    } else {
      res.json({
        code: 400,
        message: "Cập nhật trạng thái thất bại!"
      })
    }
  } catch (error) {
    res.json(error)
  }
}

// PATCH /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const ids = req.body.ids
    const key = req.body.key
    const value = req.body.value

    const objectUpdate = {}

    if (key === 'deleted') {
      objectUpdate.deleted = true
      objectUpdate.deletedAt = new Date()
    } else {
      objectUpdate[key] = value
    }


    const tasks = await Task.updateMany({
      _id: {
        $in: ids
      },
      deleted: false 
    },objectUpdate)

    if (tasks.acknowledged) {
      res.json({
        code: 200,
        message: "Cập nhật thành công!"
      })
    } else {
      res.json({
        code: 400,
        message: "Cập nhật thất bại!"
      })
    }
  } catch (error) {
    res.json(error)
  }
}

// POST /api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    req.body.createdBy = req.user.id
    const task = await Task.create({
      ...req.body
    })

    if (task) {
      res.json({
        code: 200,
        message: "Thêm mới thành công!",
        data: task
      })
    } else {
      res.json({
        code: 400,
        message: "Thêm mới thất bại!"
      })
    }
  } catch (error) {
    res.json(error)
  }
}

// PATCH /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id

    const task = await Task.findOneAndUpdate({
      _id: id,
      deleted: false 
    }, req.body, {
      new: true
    })

    if (task) {
      res.json({
        code: 200,
        message: "Cập nhật thành công!",
        data: task
      })
    } else {
      res.json({
        code: 400,
        message: "Cập nhật thất bại!"
      })
    }
  } catch (error) {
    res.json(error)
  }
}

// DELETE /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id

    const task = await Task.findOneAndUpdate({
      _id: id,
      deleted: false 
    }, {
      deleted: true,
      deletedAt: new Date()
    })

    if (task) {
      res.json({
        code: 200,
        message: "Xóa thành công!"
      })
    } else {
      res.json({
        code: 400,
        message: "Xóa thất bại!"
      })
    }
  } catch (error) {
    res.json(error)
  }
}