/**
 * Development specific configuration
 */

'use strict';

var vars = require('./vars');

var development = {
    // root
    port: process.env.PORT || vars.port || 5000,
    // Server IP
    ip: process.env.IP || "0.0.0.0"
}

module.exports = development;