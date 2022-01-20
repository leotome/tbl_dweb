const users = require("../models/config_models").users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = async (req, res) => {
    if (req.body === undefined || !req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    const Email = req.body.Email;
    users.cRud_usersByEmail([Email])
    .then(async (result) => {
        if(await bcrypt.compare(req.body.Password, result[0].Password)) {
            const User = { Email : result[0].Email };
            const accessToken = jwt.sign(User, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({ message : "Login sucessful!", accessToken: accessToken });
        } else {
            const message = { message : "Password incorrect." };
            return res.status(401).send(message);
        }
    })
    .catch((error) => {
        return res.status(401).send({message: JSON.stringify(error)});
    })
}

// REGISTAR - cria um novo utilizador
exports.register = async (req, res) => {
    if (!req.body) {
        const message = { message: "Body cannot be empty." };
        return res.status(400).send(message);
    }
    try {
        const body = req.body;
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(body.Password, salt);
        const record = [body.FirstName, body.LastName, body.Phone, body.Email, hashPassword];
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


// Este método será importante para garantir que as chamadas à API são feitas apenas por utilizadores autenticados
// Ainda não implementado, por isso fica comentado. =)
/*
exports.authenticateToken = (req, res) => {
    const Authorization = req.headers["authorization"];
    if(Authorization !== undefined){
        const token = Authorization && Authorization.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return false;
            }
            return true;
          });
    } else {
        return false;
    }
}
*/