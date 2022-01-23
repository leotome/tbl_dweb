module.exports = app => {
    var router = require('express').Router();
    const controller = require("../../controllers/config_controllers");

    // @http-verb : post
    // @table : User
    // @body : expects { "Email" : string, "Password" : string }
    router.post('/users/login', controller.users.login);

    // @http-verb : post
    // @table : User
    // @body : expects { "FirstName" : string, "LastName" : string, "Phone" : string, "Email" : string, "Password" : string }
    router.post('/users/register', controller.users.register);    

    // @http-verb : get
    // @table : ActivityQuestion
    // @header : expects Authorization Bearer
    // @body : expects queryString param "id", which is the Activity_PK
    router.get('/activities/questions/:id', controller.activities.getQuestions);

    // @http-verb : get
    // @table : CourseGroup
    // @header : expects Authorization Bearer
    router.get('/courses/assigned', controller.courses.cRud_studentCourses);

    // @http-verb : get
    // @table : Course
    // @header : expects Authorization Bearer
    router.get('/courses/all', controller.courses.cRud_allCourses);

    // @http-verb : post
    // @table : Course
    // @header : expects Authorization Bearer
    // @body : expects { "Name" : string, "ImagePath" : string }
    router.get('/courses/create', controller.courses.Crud_createCourse);

    // @http-verb : patch
    // @table : Course
    // @header : expects Authorization Bearer
    // @body : expects { "Name" : string, "ImagePath" : string }
    router.patch('/courses/update/:Course_PK', controller.courses.crUd_updateCourse);

    app.use('/services/v1.0', router);
}