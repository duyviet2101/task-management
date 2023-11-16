const md5 = require('md5')
const User = require('../models/user.model.js')
const ForgotPassword = require('../models/forgot-password.model.js')

const generateHelper = require('../../../helpers/generate.js')
const sendMailHelper = require('../../../helpers/sendMail.js')

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

//  POST /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email

    const user = await User.findOne({
      email: email,
      deleted: false
    })

    if (!user) {
      return res.json({
        code: 404,
        message: 'Email not exist'
      })
    }
    //! tạo otp và lưu vào db

    const otp = generateHelper.generateRandomNumber(8)

    const objectForgotPassword = {
      email,
      otp,
      expireAt: Date.now()
    }
    const forgotPassword = await ForgotPassword.create(objectForgotPassword)
    
    //! gửi otp qua email
    const subject = 'OTP forgot password'
    const html = `
      <h1>OTP</h1>
      <p>${otp}</p>
      Expire at: ${forgotPassword.expireAt}
    `
    sendMailHelper.sendMail(email, subject, html)

    if (forgotPassword) {
      res.json({
        code: 200,
        message: 'OTP sent!'
      })
    }
    
  } catch (error) {
    res.json({
      code: 404
    })
  }
}