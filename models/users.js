const mysql = require("./config_sql");

exports.cRud_usersByEmail = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT User_PK, FirstName, LastName, Language, Phone, Email, Password, Type_FK FROM User WHERE Email IN (?)", [params.Email])
            .then(([result]) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error.sqlMessage);
            });
        })
        .catch((error) => {
            console.log("Query:");
            console.log(error);
            reject(error);
        });
    });
}

exports.Crud_registerUser = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .execute("INSERT INTO User (FirstName, LastName, Phone, Email, Password, Type_FK) VALUES (?, ?, ?, ?, ?, '1')", params)
            .then(([result]) => {                
                resolve(result);
            })
            .catch((error) => {
                reject(error.sqlMessage);
            });
        })
        .catch((error) => {
            console.log(error);
            reject(error);
        });
    });
}