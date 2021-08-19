/**
 * Development specific configuration
 */

'use strict';

var vars = require('./vars');


var development = {
    // root
    port: vars.port,
    // Server IP
    ip: 'localhost'
}

module.exports = development;