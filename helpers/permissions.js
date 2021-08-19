var perms = {
    trainee: [
        "trainee",
        "user:read",
        "user:update",
        "user:write",
        "user:document:write",
        "user:document:read",
        "user:document:delete"
    ],
    healthCoach:[
        "user:read",
        "user:update",
        "user:write",
        "healthCoach",
        "user:document:write",
        "user:document:read",
        "user:document:delete"
    ],
    admin: [
        "admin"
    ]
}

module.exports = {
	setPermisionByAccountType(type) {
        if(perms[type]!==null && perms[type]!==undefined) {
            return perms[type];
        }
		return [];
    }
}
