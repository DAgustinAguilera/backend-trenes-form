const jwt = require("jsonwebtoken")

const generateJWT = (token_payloud) => {
    let token = null
    token = jwt.sign(token_payloud, process.env.SECRET_WEB_TOKEN)

    return token
}

module.exports = generateJWT