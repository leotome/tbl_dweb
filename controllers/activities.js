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
        return res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.cRud_numberOfStudentsActivity = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    let params = {};
    if(req.params.Activity_PK != null){
        params["Activity_PK"] = req.params.Activity_PK
    }
    activities.cRud_numberOfStudentsActivity(params)
    .then(result => {
        return res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.cRud_numberOfStudentsFinishedActivity = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    let params = {};
    if(req.params.Activity_PK != null){
        params["Activity_PK"] = req.params.Activity_PK
    }
    activities.cRud_numberOfStudentsFinishedActivity(params)
    .then(result => {
        return res.status(200).send(result);
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
        return res.status(200).send(result);
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
        return res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.Crud_submitActivity = async (req, res) => {
    console.log('Crud_submitActivity')
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if(req.params.Activity_PK === null){
        const message = { message: "Missing parameter Activity_PK." };
        return res.status(400).send(message);
    }
    if (req.body === undefined || !req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    activities.cRud_questionsByActivity({Activity_PK : req.params.Activity_PK})
    .then(result => {
        let dbChoices = result;
        let userChoices = req.body;
        // A "Question" record is made up of a set of fields.
        // The structure of the questions are fields prefixed by "Answer", respecting the syntax "AnswerN_Text" and "AnswerN_Score".
        // We need to compare the array received from the request with the information stored in the database
        // So, we iterate each UserChoice, comparing using a key (which is "Question_PK"), and we use the nature of JSON objects to compare the data
        let ActivityDoneStudent = {
            Activity_FK : parseInt(req.params.Activity_PK),
            Student_FK : TokenData.User_PK,
            IsCompleted : (userChoices.filter(({UserChoice}) => UserChoice == null).length > 0) ? 0 : 1,
            TotalScore : 0.00
        }
        let ActivityAnswersStudent = [];
        userChoices.forEach(choice => {
            let dbChoice = dbChoices.find(({Question_PK}) => Question_PK == choice.Question_PK);
            Object.keys(dbChoice).forEach(dbChoice_key => {
                if((dbChoice_key.includes('Answer') == true) && (dbChoice_key.includes('Score') == true) && (dbChoice[dbChoice_key] != null) && (dbChoice[dbChoice_key] > 0)){
                    let dbAnswer_text = dbChoice_key.split("_")[0] + "_Text";
                    let dbAnswer_value = dbChoice[dbChoice_key];
                    let ActivityAnswerStudent = {
                        Activity_FK : parseInt(req.params.Activity_PK),
                        Student_FK : parseInt(TokenData.User_PK),
                        Question_FK : parseInt(choice.Question_PK),
                        Answer : choice.UserChoice,
                        Score : 0.00
                    }
                    if(choice.UserChoice == dbAnswer_text){ // Is the answer chosen by the user the correct answer?
                        ActivityDoneStudent.TotalScore += parseFloat(dbAnswer_value);
                        ActivityAnswerStudent.Score = parseFloat(dbAnswer_value);
                    }
                    ActivityAnswersStudent.push(ActivityAnswerStudent);
                }
            })
        })
        activities.Crud_activitySubmit(ActivityDoneStudent, ActivityAnswersStudent)
        .then(insert_result => {
            return res.status(200).send({ message : "The activity was successfully submitted!" });
        })
        .catch(error => {
            return res.status(401).send({message: JSON.stringify(error)});
        })
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}