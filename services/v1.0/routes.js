module.exports = app => {
    var router = require('express').Router();
    const controller = require("../../controllers/config_controllers");

    // @http-verb : post
    // @table : User
    // @body : expects { "Email" : "xpto@xpt.com", "Password" : "qwerty" }
    router.post('/users/login', controller.users.login);

    // @http-verb : post
    // @table : User
    // @body : expects { "FirstName" : "XPTO", "LastName" : "XPTO", "Phone" : "+351900000000", "Email" : "xpto@xpt.com", "Password" : "qwerty" }
    router.post('/users/register', controller.users.register);    

    // @http-verb : get
    // @table : ActivityQuestion
    // @header : expects Authorization Bearer
    // @body : expects { "Email" : "xpto@xpt.com", "Password" : "qwerty" }
    router.get('/activities/questions/:id', controller.activities.getQuestions);

    app.use('/services/v1.0', router);
}