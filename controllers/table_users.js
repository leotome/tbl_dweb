const users = require("../models/config_models").users;

exports.login = async (req, res) => {
    if (req.body === undefined || req.body === null) {
        return res.status(400).send({message: "O conteúdo não pode ser vazio!"});
    }
    users.cRud_usersByEmail(req.body.emails)
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}