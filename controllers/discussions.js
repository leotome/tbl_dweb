const utils = require("./config_utils");
const discussions = require("../models/config_models").discussions;
const users = require("../models/config_models").users;

exports.cRud_discussionsByModule = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    discussions.cRud_discussionsByModule({ Module_FK : req.params.Module_PK })
    .then(result => {
        result.forEach(record => {
            record["CreatedByIsLogged"] = record.CreatedByEmail == TokenData.Email;
        })
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.Crud_insertPost = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if (!req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    users.cRud_usersByEmail(TokenData)
    .then(async (result) => {
        if(result.length == 0){
            const message = { message : "Something went wrong. Please try again, or contact support." };
            return res.status(403).send(message);
        }
        let record = {
            Module_FK : req.body.Module_FK,
            Body : req.body.Body,
            CreatedBy_FK : result[0].User_PK,
        }
        discussions.Crud_insertPost(record)
        .then(result => {
            return res.status(200).send(result);
        })
        .catch(error => {
            return res.status(401).send({message: JSON.stringify(error)});
        })
    })
}

exports.cruD_deletePost = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if(req.params.Discussion_PK === null){
        const message = { message: "Missing parameter Discussion_PK." };
        return res.status(400).send(message);
    }    
    users.cRud_usersByEmail(TokenData)
    .then(async (result) => {
        if(result.length == 0){
            const message = { message : "Something went wrong. Please try again, or contact support." };
            return res.status(403).send(message);
        }
        discussions.cruD_deletePost({Discussion_PK : req.params.Discussion_PK, CreatedBy_FK : result[0].User_PK})
        .then(result => {
            return res.status(200).send(result);
        })
        .catch(error => {
            return res.status(401).send({message: JSON.stringify(error)});
        })
    })
}