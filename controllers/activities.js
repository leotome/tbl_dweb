const utils = require("./config_utils");
const activities = require("../models/config_models").activities;

exports.cRud_allActivities = async (req, res) => {
    let TokenData = utils.authenticateToken(req.headers);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    activities.cRud_allActivities()
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.cRud_questionsByActivity = async (req, res) => {
    let TokenData = utils.authenticateToken(req.headers);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    activities.cRud_questionsByActivity(req.params.id)
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}