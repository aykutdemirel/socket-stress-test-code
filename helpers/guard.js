const guard = require('express-jwt-permissions')({
    permissionsProperty: 'permissions'
});

module.exports = guard;