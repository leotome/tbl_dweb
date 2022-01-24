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

    // @http-verb : get
    // @table : Module
    // @header : expects Authorization Bearer
    // @body : expects queryString param "Course_FK", which is the Course_FK
    router.get('/courses/modules/:Course_FK', controller.modules.cRud_modulesByCourse);

    // @http-verb : get
    // @table : ModuleDiscussion
    // @header : expects Authorization Bearer
    // @body : expects queryString param "Module_FK", which is the Module_FK
    router.get('/courses/modules/discussions/:Module_FK', controller.discussions.cRud_discussionsByModule);

    // @http-verb : post
    // @table : ModuleDiscussion
    // @header : expects Authorization Bearer
    // @body : expects queryString param "Module_FK", which is the Module_FK, and { "Module_FK" : integer, "Body" : string, "CreatedBy_FK" : integer }
    router.post('/courses/modules/discussions/create/:Module_FK', controller.discussions.Crud_insertMessage);

    // @http-verb : get
    // @table : Activity
    // @header : expects Authorization Bearer
    // @body : expects queryString param "Module_FK", which is the Module_FK
    router.get('/courses/modules/activities/:Module_FK', controller.activities.cRud_activitiesByModule);

    // @http-verb : get
    // @table : Question
    // @header : expects Authorization Bearer
    // @body : expects queryString param "Activity_FK", which is the Activity_FK
    router.get('/courses/modules/activities/questions/:Activity_FK', controller.questions.cRud_questionsByActivity);

    // @http-verb : get
    // @table : ActivityQuestion
    // @header : expects Authorization Bearer
    // @body : expects queryString param "id", which is the Activity_PK
    router.get('/activities/questions/:id', controller.activities.cRud_questionsByActivity);

    app.use('/services/v1.0', router);
}