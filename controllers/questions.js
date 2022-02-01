const utils = require("./config_utils");
const questions = require("../models/config_models").questions;

exports.cRud_questionsByActivity = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if(req.params.Activity_PK === null){
        const message = { message: "Missing parameter Activity_PK." };
        return res.status(400).send(message);
    }    
    questions.cRud_questionsByActivity({Activity_PK : req.params.Activity_PK})
    .then(result => {
        return res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.cRud_questionsAnsweredByActivity = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if(req.params.Activity_PK === null){
        const message = { message: "Missing parameter Activity_PK." };
        return res.status(400).send(message);
    }    
    questions.cRud_questionsAnsweredByActivity({Activity_PK : req.params.Activity_PK, Student_FK : TokenData.User_PK})
    .then(result => {
        return res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.cRud_allQuestions = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    questions.cRud_allQuestions()
    .then(result => {
        return res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}