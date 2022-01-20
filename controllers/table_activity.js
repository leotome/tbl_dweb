const activity = require("../models/config_models").activity;

exports.getAll = async (req, res) => {
    activity.cRud_allActivities()
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.getQuestions = async (req, res) => {
    activity.cRud_questionsByActivity(req.params.id)
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}