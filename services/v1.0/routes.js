module.exports = app => {
    var router = require('express').Router();
    const controller = require("../../controllers/config_controllers");

    // @http-verb : post
    // @table : User
    // @body : expects { "emails" : [...]}
    router.post('/users/login', controller.user.login);

    router.get('/activities/questions/:id', controller.activity.getQuestions);

    app.use('/services/v1.0', router);
}