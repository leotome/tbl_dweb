const mysql = require("mysql2/promise");
require("dotenv").config();

exports.connect = () => {
    const config = {
        db : {
            host : process.env.DB_HOST || undefined,
            port : process.env.DB_PORT || undefined,
            database : process.env.DB_NAME || undefined,
            user : process.env.DB_USER || undefined,
            password : process.env.DB_PASSWORD || undefined,
            //debug: ['ComQueryPacket', 'RowDataPacket']
        },
        listPerPage: process.env.DB_LIST_PER_PAGE || 10,
    }
    return new Promise((resolve, reject) => {
        if (!global.connection || global.connection.state == "disconnected") {
            mysql.createConnection(config.db)
            .then((connection) => {
                global.connection = connection;
                console.log("New connection to mySQL"); 
                resolve(connection);
            })
            .catch((error) => {
                console.log("Error while connecting to MySQL...");
                console.log(error);
                reject(error.code);
            });
        } else {
            connection = global.connection;
            resolve(connection);
        }
    });
}