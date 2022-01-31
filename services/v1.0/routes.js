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
    // @table : User
    router.get('/users/information', controller.users.information);

    // @http-verb : get
    // @table : User
    router.get('/users/logout', controller.users.logout);

    // @http-verb : post
    // @table : User
    // @body : expects { "FirstName" : string, "LastName" : string, "Phone" : string }
    router.post('/users/update', controller.users.crUd_updateUser);

    // @http-verb : get
    // @table : Course
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    router.get('/courses', controller.courses.cRud_allCourses);


    // @http-verb : get
    // @table : CourseGroup
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    router.get('/courses/assigned', controller.courses.cRud_studentCourses);

    // @http-verb : post
    // @table : Course
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    // @body : expects { "Name" : string, "ImagePath" : string }
    router.get('/courses/create', controller.courses.Crud_createCourse);    

    // @http-verb : get
    // @table : Course
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    router.get('/courses/:Course_PK', controller.courses.cRud_courseById);

    // @http-verb : patch
    // @table : Course
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    // @body : expects { "Name" : string, "ImagePath" : string }
    router.patch('/courses/:Course_PK/update', controller.courses.crUd_updateCourse);

    // @http-verb : get
    // @table : Module
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    // @body : expects queryString param "Course_FK", which is the Course_FK
    router.get('/courses/:Course_PK/modules', controller.modules.cRud_modulesByCourse);

    // @http-verb : get
    // @table : Module
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    // @body : expects queryString param "Course_FK", which is the Course_FK
    router.get('/courses/:Course_PK/modules/:Module_PK', controller.modules.cRud_moduleById);

    // @http-verb : get
    // @table : ModuleDiscussion
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    // @body : expects queryString param "Module_FK", which is the Module_FK
    router.get('/courses/:Course_PK/modules/:Module_PK/discussions', controller.discussions.cRud_discussionsByModule);

    // @http-verb : post
    // @table : ModuleDiscussion
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    // @body : expects queryString param "Module_FK", which is the Module_FK, and { "Module_FK" : integer, "Body" : string}
    router.post('/courses/:Course_PK/modules/:Module_PK/discussions/create', controller.discussions.Crud_insertPost);

    // @http-verb : get
    // @table : ModuleDiscussion
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    router.get('/discussions/delete/:Discussion_PK', controller.discussions.cruD_deletePost);

    // @http-verb : get
    // @table : Activity
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    // @body : expects queryString param "Module_FK", which is the Module_FK
    router.get('/courses/:Course_PK/modules/:Module_PK/activities', controller.activities.cRud_activitiesByModule);

    // @http-verb : get
    // @table : Activity
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    // @body : expects queryString param "Activity_PK", which is the Activity_PK
    router.get('/activities/:Activity_PK', controller.activities.cRud_activitiesById);

    // @http-verb : get
    // @table : Activity
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    // @body : expects queryString param "Activity_PK", which is the Activity_PK
    router.get('/activities/:Activity_PK/countStudents', controller.activities.cRud_numberOfStudentsActivity);

    // @http-verb : get
    // @table : Question
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    // @body : expects queryString param "Activity_PK", which is the Activity_PK
    router.get('/activities/questions/:Activity_PK', controller.questions.cRud_questionsByActivity);   

    // @http-verb : post
    // @table : ActivityDoneStudent
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    // @body : expects array of { Question_PK : integer, UserChoice : string }
    router.post('/activities/:Activity_PK/submit', controller.activities.Crud_submitActivity);

    // @http-verb : get
    // @table : Question
    // @auth : header Authorization Bearer OR Cookie "tbl_app"
    // @body : expects queryString param "Activity_PK", which is the Activity_PK
    router.get('/activities/questions/:Activity_PK/answered', controller.questions.cRud_questionsAnsweredByActivity);

    app.use('/services/v1.0', router);
}