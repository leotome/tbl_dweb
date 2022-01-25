const utils = require("./config_utils");
const questions = require("../models/config_models").questions;

exports.cRud_questionsByActivity = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if(req.params.Activity_FK === null){
        const message = { message: "Missing parameter." };
        return res.status(400).send(message);
    }
    questions.cRud_questionsByActivity({Language : TokenData.Language, Activity_FK : req.params.Activity_FK})
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}