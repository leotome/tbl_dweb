const utils = require("./config_utils");
const courses = require("../models/config_models").courses;
const users = require("../models/config_models").users;

exports.cRud_studentCourses = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    courses.cRud_studentCourses(TokenData)
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}


exports.cRud_courseById = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if(req.params.Course_PK === undefined){
        const message = { message: "Missing parameter." };
        return res.status(400).send(message);
    }          
    courses.cRud_studentCourses(TokenData)
    .then(result => {
        let UserHasCourse = result.find(({Course_PK}) => Course_PK == req.params.Course_PK);
        if(UserHasCourse == null){
            return res.status(403).send({message : "You're not assigned to this course."});
        }
        return res.status(200).send(UserHasCourse);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.cRud_allCourses = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    courses.cRud_allCourses()
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.Crud_createCourse = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if (req.body === undefined || !req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    // FIRST, WE NEED TO VERIFY IF LOGGED USER IS SYSTEM ADMINISTRATOR
    // PERFORM THIS QUERY, THEN DECIDE...
    users.cRud_usersByEmail(TokenData.Email)
    .then(result => {
        // SYSTEM ADMINISTRATOR PROFILE IS Type_FK = 0
        if(result.Type_FK != 0){
            // IF IT ISN'T, RETURN NOT AUTHORIZED.
            const message = { message: "You are not authorized to perform this action." };
            return res.status(400).send(message);
        } else {
            // IF IT IS, GET ALL COURSES
            courses.Crud_createCourse(req.body)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                return res.status(401).send({message: JSON.stringify(error)});
            })
        }
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.crUd_updateCourse = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if (req.body === undefined || !req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    // FIRST, WE NEED TO VERIFY IF LOGGED USER IS SYSTEM ADMINISTRATOR
    // PERFORM THIS QUERY, THEN DECIDE...
    users.cRud_usersByEmail(TokenData.Email)
    .then(result => {
        // SYSTEM ADMINISTRATOR PROFILE IS Type_FK = 0
        if(result[0].Type_FK != 0){
            // IF IT ISN'T, RETURN NOT AUTHORIZED.
            const message = { message: "You are not authorized to perform this action." };
            return res.status(400).send(message);
        } else {
            // IF IT IS, GET ALL COURSES
            courses.crUd_updateCourse(req.params.Course_PK, req.body)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                return res.status(401).send({message: JSON.stringify(error)});
            })
        }
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}