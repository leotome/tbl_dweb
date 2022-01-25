const utils = require("./config_utils");
const modules = require("../models/config_models").modules;

exports.cRud_modulesByCourse = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if(req.params.Course_FK === undefined){
        const message = { message: "Missing parameter." };
        return res.status(400).send(message);
    }
    modules.cRud_modulesByCourse({Language : TokenData.Language, Course_FK : req.params.Course_FK})
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