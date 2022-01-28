const mysql = require("./config_sql");

exports.cRud_discussionsByModule = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT D.Discussion_PK, D.Module_FK, D.Body, D.CreatedDate, CONCAT(U.FirstName, ' ', U.LastName) AS CreatedByName, U.Email AS CreatedByEmail FROM ModuleDiscussion D INNER JOIN User U ON D.CreatedBy_FK = U.User_PK WHERE D.Module_FK = ? ORDER BY CreatedDate DESC", [params.Module_FK])
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

exports.Crud_insertPost = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("INSERT INTO ModuleDiscussion (Module_FK, Body, CreatedDate, CreatedBy_FK) VALUES (?, ?, ?, ?)", [params.Module_FK, params.Body, new Date().toISOString().slice(0, 19).replace('T', ' '), params.CreatedBy_FK])
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

exports.cruD_deletePost = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("DELETE FROM ModuleDiscussion WHERE Discussion_PK = ? AND CreatedBy_FK = ?", [params.Discussion_PK, params.CreatedBy_FK])
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