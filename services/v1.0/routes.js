module.exports = app => {
    var router = require('express').Router();
    const controller = require("../../controllers/config_controllers");

    // @http-verb : post
    // @table : User
    // @body : expects { "emails" : [...]}
    router.post('/users/login', controller.users.login);

    app.use('/services/v1.0', router);
}