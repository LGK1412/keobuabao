const userModel = require('../models/userModel')

exports.checkUsernameExist = async (req, res, next) => {
    const { username } = req.body

    try {
        const existingUser = await userModel.findOne({ username }).select("+isBan")

        if (existingUser) {
            return res.status(409).json({ success: false, message: "Username đã tồn tại!" })
        }

        next()
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server!" })
    }
}

exports.checkBeforeLogin = async (req, res, next) => {
    const { username, password } = req.body
    try {
        const existingUser = await userModel.findOne({ username }).select("+password +isBan")

        if (!existingUser) {
            return res.status(409).json({ success: false, message: "Username không tồn tại!" })
        }

        if (existingUser.isBan) {
            return res.status(409).json({ success: false, message: "Tài khoản bị Cấm, Vui lòng liên hệ hỗ trợ!" })
        }

        req.payload = existingUser

        next()
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server!" })
    }
}