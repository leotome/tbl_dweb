const mysql = require("./config_sql");

exports.cRud_usersByEmail = (params) =>{
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT User_PK, FirstName, LastName, Phone, Email, Password, Type FROM User WHERE Email IN (?)", [params])
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