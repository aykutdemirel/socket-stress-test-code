/**
 * Express configuration
 */

'use strict';

var helmet = require("helmet")
var morgan = require('morgan')
var compress = require('compression')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var errorHandler = require('errorhandler')
var useragent = require('express-useragent')
var config = require('./environment')

module.exports = function (app) {

    var env = app.get('env')

    app.use(compress())
    app.use(useragent.express())

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

    //upload img
    //app.use(busboy())

    app.use(methodOverride())

    // cookieSession
    app.use(cookieParser(config.secrets.cookie))
    app.use(cookieSession({
        name: 'session',
        secret: config.secrets.session,
        cookie: {
            maxAge: 2678400000 // 31 days
        }
    }))

    //Secure Express Apps
    app.use(helmet())

    if (env === 'production') {

    }

    if (env === 'development') {
        
        //app.use(require('connect-livereload')())
        app.use(morgan('dev'))
        app.use(errorHandler()) // error handler has to be last
    }

}