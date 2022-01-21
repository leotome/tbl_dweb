const mysql = require("mysql2/promise");
require("dotenv").config();

exports.connect = () => {
    const config = {
        db : {
            host : process.env.DB_HOST || 'holonet.pt',
            database : process.env.DB_NAME || 'holonetp_ual_dweb_tbl',
            user : process.env.DB_USER || 'holonetp_ual_dweb_admin',
            password : process.env.DB_PASSWORD || 'gtK7qgRyF5VXh67U'
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