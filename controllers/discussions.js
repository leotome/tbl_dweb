const utils = require("./config_utils");
const discussions = require("../models/config_models").discussions;

exports.cRud_discussionsByModule = async (req, res) => {
    let TokenData = utils.authenticateToken(req.headers);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    discussions.cRud_discussionsByModule({ Module_FK : req.params.Module_FK })
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.Crud_insertMessage = async (req, res) => {
    let TokenData = utils.authenticateToken(req.headers);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if (!req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    discussions.Crud_insertMessage({ Module_FK : req.body.Module_FK, Body : req.body.Body, CreatedBy_FK : req.body.CreatedBy_FK })
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}




