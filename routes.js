/**
 * Main application routes
 */

'use strict';

const config = require('./config/environment');
const jwt = require('express-jwt');
var cors = require('cors');

module.exports = function (app) {
    app.use(cors())

    app.use(jwt({secret: config.jwt.secret, algorithms: ['RS256']}).unless({path: ['/api/v1/veganzone-test']}));
    app.use('/api/v1/veganzone-test',require('./api/test_control'));
/*    app.use('/api/v1/registration', require('./api/registration'));
    app.use('/api/v1/users', require('./api/users'));
    app.use('/api/v1/feedbacks', require('./api/feedbacks'));
    app.use('/api/v1/invited-users', require('./api/invited-users'));
    app.use('/api/v1/notes', require('./api/notes'));*/

    app.use(function (err, req, res, next) {
        if (err.code === 'permission_denied') {
            res.status(403).send({"error":"forbidden"});
        }else {
            res.status(403).send({"error":err});
        }
    });

}