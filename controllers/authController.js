const authService = require('../services/authService')

exports.register = async (req, res) => {
    const { username, password } = req.body
   
    try {
        const result = await authService.register(username, password)

        if (result.success) {
            return res.status(200).json({ success: true, message: result.message })
        } else {
            return res.status(401).json({ success: false, message: result.message })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server" })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body
    const payload = req.payload
    
    try {
        const result = await authService.login(username, password, payload)

        if (result.success) {
            return res.status(200).json({ success: true, message: result.message, token: result.token })
        } else {
            return res.status(401).json({ success: false, message: result.message })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server" })
    }
}