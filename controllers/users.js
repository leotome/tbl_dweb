const users = require("../models/config_models").users;
const utils = require("./config_utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = async (req, res) => {
    if (req.body === undefined || !req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    users.cRud_usersByEmail(req.body)
    .then(async (result) => {
        if(result.length == 0){
            const message = { message : "User not found." };
            return res.status(401).send(message);
        }
        if(await bcrypt.compare(req.body.Password, result[0].Password)) {
            const User = { 
                User_PK : result[0].User_PK,
                FirstName : result[0].FirstName,
                LastName : result[0].LastName,
                Phone : result[0].Phone,
                Email : result[0].Email
            };
            const accessToken = jwt.sign(User, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 7 * 60 * 60});
            res.cookie("tbl_app", accessToken, {maxAge: 1000 * 60 * 60 * 7, httpOnly: true});
            return res.status(200).json({ message : "Login sucessful!", fullName : User.FirstName + ' ' + User.LastName , accessToken: accessToken, Type_FK : result[0].Type_FK });
        } else {
            const message = { message : "Password incorrect." };
            return res.status(401).send(message);
        }
    })
    .catch((error) => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

exports.register = async (req, res) => {
    if (!req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    try {
        const body = req.body;
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(body.Password, salt);
        const record = [body.FirstName, body.LastName, body.Phone, body.Email, hashPassword, new Date().toISOString().slice(0, 19).replace('T', ' ')];
        users.Crud_registerUser(record) // C: Create
        .then((result) => {
            var response = { message: "User created successfully!" };
            res.status(201).send(response);
        })
        .catch((error) => {
            res.status(400).send({message: JSON.stringify(error)});
        });
    } catch {
        return res.status(400).send({ message: "Bad Request" });
    }
};

exports.information = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    users.cRud_usersByEmail(TokenData)
    .then((result) => {
        return res.status(200).send(result);
    })
    .catch((error) => {
        res.status(400).send({message: JSON.stringify(error)});
    });
};

exports.logout = async (req, res) => {
    res.clearCookie('tbl_app');
    res.status(440).send({message : 'Logout successful'});
};

exports.crUd_updateUser = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    if (!req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    if(req.body.User_PK != null){
        users.crUd_updateUser(req.body)
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((error) => {
            res.status(400).send({message: JSON.stringify(error)});
        });
    } else {
        users.cRud_usersByEmail(TokenData)
        .then((result) => {
            if(result[0].Email != req.body.Email){
                const message = { message: "You are not authorized to perform this action." };
                return res.status(400).send(message);
            } else {
                users.crUd_updateUser({ User_PK : result[0].User_PK, FirstName : req.body.FirstName, LastName : req.body.LastName, Phone : req.body.Phone })
                .then((result) => {
                    return res.status(200).send(result);
                })
                .catch((error) => {
                    res.status(400).send({message: JSON.stringify(error)});
                });
            }
        })
        .catch((error) => {
            res.status(400).send({message: JSON.stringify(error)});
        });
    }
};

exports.cRud_getAllUsers = async (req, res) => {
    let TokenData = utils.authenticateToken(req);
    if(TokenData === null){
        const message = { message: "You are not authorized to perform this action." };
        return res.status(400).send(message);
    }
    users.cRud_getAllUsers()
    .then((result) => {
        if(result.find(({User_PK}) => User_PK == TokenData.User_PK).Type_PK == 0){
            return res.status(200).send(result);
        } else {
            const message = { message: "You are not authorized to perform this action." };
            return res.status(400).send(message);
        }
    })
    .catch((error) => {
        res.status(400).send({message: JSON.stringify(error)});
    });
};