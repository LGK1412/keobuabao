const jwt = require('jsonwebtoken')

const userModel = require('../models/userModel')
const { hashingPassword, comparePassword } = require("../utils/hasingPassword")

exports.register = async (username, password) => {
    console.log('vào services')
    const hashedPassword = await hashingPassword(password)

    const newUser = userModel({
        username,
        password: hashedPassword
    })

    const result = await newUser.save()

    if (result) {
        return { success: true, message: "Đăng ký thành công. Vui lòng đăng nhập!" }
    }

    return { success: false, message: "Đăng ký thất bại!" }
}

exports.login = async (username, password, payload) => {
    const comparePasswordResult = await comparePassword(password, payload.password)

    if (comparePasswordResult) {
        const userInfor = {
            username: payload.username,
            point: payload.point,
            streak: payload.streak
        }

        const token = jwt.sign(userInfor, process.env.TOKEN_SECRET, { expiresIn: '7d' })

        const user = await userModel.findOne({ username })

        user.lastLogin = new Date()

        await user.save()

        return { success: true, message: "Đăng nhập thành công!", token }
    }

    return { success: false, message: "Đăng nhập thất bại!" }
}