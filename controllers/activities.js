const activities = require("../models/config_models").activities;

exports.getAll = async (req, res) => {
    activities.cRud_allActivities()
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.getQuestions = async (req, res) => {
    activities.cRud_questionsByActivity(req.params.id)
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}