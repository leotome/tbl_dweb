const utils = require("./config_utils");
const courses = require("../models/config_models").courses;
const modules = require("../models/config_models").modules;

exports.cRud_modulesByCourse = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if(req.params.Course_PK === undefined){
        const message = { message: "Missing parameter." };
        return res.status(400).send(message);
    }
    modules.cRud_modulesByCourse({Language : TokenData.Language, Course_FK : req.params.Course_PK})
    .then(result => {
        if(TokenData.Language == 'en'){
            res.status(200).send(result);
        } else {
            result.forEach(record => {
                record.Module_PK = record.Parent_FK;
                record.Parent_FK = undefined;
            })
            res.status(200).send(result);
        }
        
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.cRud_moduleById = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if(req.params.Course_PK === undefined){
        const message = { message: "Missing parameter Course_PK." };
        return res.status(400).send(message);
    }
    if(req.params.Module_PK === undefined){
        const message = { message: "Missing parameter Module_PK." };
        return res.status(400).send(message);
    }
    courses.cRud_studentCourses(TokenData)
    .then(result => {
        let UserHasCourse = result.find(({Course_PK}) => Course_PK == req.params.Course_PK);
        if(UserHasCourse == null){
            return res.status(403).send({message : "You're not assigned to this course."});
        }
        modules.cRud_moduleById({Module_PK : req.params.Module_PK, Course_FK : req.params.Course_PK})
        .then(result => {
            if(result.length > 0){
                return res.status(200).send(result[0]);
            } else {
                return res.status(404).send({ message: "Module not found." });
            }
        })
        .catch(error => {
            return res.status(401).send({message: JSON.stringify(error)});
        })
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}