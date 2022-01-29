const utils = require("./config_utils");
const activities = require("../models/config_models").activities;

exports.cRud_activitiesById = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if(req.params.Activity_PK === null){
        const message = { message: "Missing parameter Activity_PK." };
        return res.status(400).send(message);
    }
    activities.cRud_activitiesById({ Activity_PK : req.params.Activity_PK })
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.cRud_noStudentsActivity = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    let params = {};
    if(req.params.Activity_PK != null){
        params["Activity_PK"] = req.params.Activity_PK
    }
    activities.cRud_noStudentsActivity(params)
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.cRud_noStudentsFinishedActivity = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    let params = {};
    if(req.params.Activity_PK != null){
        params["Activity_PK"] = req.params.Activity_PK
    }
    activities.cRud_noStudentsFinishedActivity(params)
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.cRud_activitiesByModule = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if(req.params.Module_PK === null){
        const message = { message: "Missing parameter Module_PK." };
        return res.status(400).send(message);
    }
    activities.cRud_activitiesByModule({ Module_FK : req.params.Module_PK })
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

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
    activities.cRud_questionsByActivity({Activity_PK : req.params.Activity_PK})
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}