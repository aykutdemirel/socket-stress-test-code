/**
 * Base configuration.
 * All configurations will extend these options
 */

'use strict';

var path = require('path')
var _ = require('lodash')

var all = {

    // root
    root: path.normalize(__dirname + "/../../.."),

    // Server IP
    ip: process.env.IP || undefined,

    // Node environment
    env: process.env.NODE_ENV,

    // Server port
    port: process.env.PORT || 5000,

    // Secret for session
    secrets: {
        cookie: process.env.COOKIE_SECRET || "wSy3nk8sIzFOCJVu5YHt5qlt44C0msjA",
        session: process.env.SESSION_SECRET || "13dcE9BKH9R6cmTG5AOe9k736hy5b556"
    },

    jwt: {
        secret: "EDD7C639-5911-4062-818D-1DC92C02B4D8",
        refreshTokenSecret: "61B00F84-1357-4502-BC74-5EE035CCE90D",
        tokenLife: "1h",
        refreshTokenLife: "10h"
    },

    aes:{ 
        encryptionKey: "cMa74e00u2LI3Vr5msDKYBI5KJLH8qFR"
    },

    // Browser cookie token name
    tokenName: "laaby.token"

}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(all, require('./' + process.env.NODE_ENV + '.js') || {})