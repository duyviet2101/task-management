const md5 = require('md5')
const User = require('../models/user.model.js')

//  POST /api/v1/users/register
module.exports.register = async (req, res) => {
  try {
    req.body.password = md5(req.body.password)
  
    const existUser = await User.findOne({
      email: req.body.email,
      deleted: false
    })

    if (existUser) {
      return res.json({
        code: 400,
        message: 'Email exist'
      })
    }

    const user = await User.create(req.body)
    
    const token = user.token;
    res.cookie('token', token);

    return res.json({
      code: 200,
      message: 'Register success',
      token: token
    })

  } catch (error) {
    console.log(error)
    res.json({
      code:404
    })
  }
}

//  POST /api/v1/users/login
module.exports.login = async (req, res) => {
  try {
    const email = req.body.email
    const password = md5(req.body.password)

    const user= await User.findOne({
      email: email,
      deleted: false
    })
    if (!user) {
      return res.json({
        code: 404,
        message: 'Email not exist'
      })
    }
    if (password != user.password) {
      return res.json({
        code: 400,
        message: 'Password wrong'
      })
    }

    const token = user.token;
    res.cookie('token', token);
    res.json({
      code: 200,
      message: 'Login success',
      token: token
    })

  } catch (error) {
    res.json({
      code: 404
    })
  }
}