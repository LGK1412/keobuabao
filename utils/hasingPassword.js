const bcrypt = require('bcrypt')

exports.hashingPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

exports.comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}