const utils = require("./config_utils");
const courses = require("../models/config_models").courses;

exports.getStudentCourses = async (req, res) => {
    let TokenData = utils.authenticateToken(req.headers);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    courses.cRud_studentCourses(TokenData)
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}