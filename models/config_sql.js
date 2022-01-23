const mysql = require("mysql2/promise");
require("dotenv").config();

exports.connect = () => {
    const config = {
        db : {
            host : process.env.DB_HOST || 'db4free.net',
            port : process.env.DB_PORT || 3306,
            database : process.env.DB_NAME || 'ual_dw_tblproj',
            user : process.env.DB_USER || 'ual_dw_tbl_admin',
            password : process.env.DB_PASSWORD || 'MNkE7kQ6ckrknzFB'
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