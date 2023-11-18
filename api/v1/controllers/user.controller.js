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

    req.body.token = generateHelper.generateRandomString(30)
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

//  POST /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  try {
    const email = req.body.email
    const otp = req.body.otp
  
    const result = await ForgotPassword.findOne({
      email: email,
      otp: otp
    })
  
    if (!result) {
      return res.json({
        code: 404,
        message: 'OTP invalid'
      })
    }
  
    const user = await User.findOne({
      email: email,
      deleted: false
    })
    const token = user.token;
    res.cookie('token', token);
  
    return res.json({
      code: 200,
      message: 'Authentication success',
      token: token
    })
  } catch (error) {
    return res.json({
      code: 404
    })
  }
}

//  POST /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
try {
  const token = req.body.token
  const password = (req.body.password)

  const user = await User.findOne({
    token: token,
    deleted: false
  })

  if (md5(password) == user.password) {
    return res.json({
      code: 400,
      message: 'Password same old password'
    })
  }

  await User.findOneAndUpdate({
    token: token,
  }, {
    password: md5(password)
  })

  res.json({
    code: 200,
    message: 'Reset password success'
  })
} catch (error) {
  res.json({
    code: 404
  })
}
}

//  GET /api/v1/users/detail
module.exports.detail = async (req, res) => {
  try {
    const token = req.cookies.token
  
    const user = await User.findOne({
      token: token,
      deleted: false
    }).select('-password -token -deleted')
  
    res.json({
      code: 200,
      message: 'oke',
      info: user
    })
  } catch (error) {
    return res.json({
      code: 404
    })
  }
}