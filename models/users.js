const mysql = require("./config_sql");

exports.cRud_usersByEmail = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT User_PK, FirstName, LastName, Phone, Email, Password, Type_FK FROM User WHERE Email IN (?)", [params.Email])
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
            .execute("INSERT INTO User (FirstName, LastName, Phone, Email, Password, Type_FK, LastModifiedDate) VALUES (?, ?, ?, ?, ?, '1', ?)", params)
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

exports.crUd_updateUser = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .execute("UPDATE User SET FirstName = ?, LastName = ?, Phone = ?, LastModifiedDate = ? WHERE User_PK = ?", [params.FirstName, params.LastName, params.Phone, new Date().toISOString().slice(0, 19).replace('T', ' '), params.User_PK])
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

exports.cRud_getAllUsers = () => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT User_PK, FirstName, LastName, Phone, Email, UserType.Type_PK, UserType.Name AS Type_Name FROM User INNER JOIN UserType ON User.Type_FK = UserType.Type_PK")
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