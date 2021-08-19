const jwt = require('jsonwebtoken')
const config = require('../config/environment')

module.exports = {
	checkJWT(token) {
        return jwt.verify(token, config.jwt.secret);
    }
}
