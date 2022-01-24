const mysql = require("./config_sql");

exports.cRud_discussionsByModule = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT Discussion_PK, Module_FK, Body, CreatedDate, CreatedBy_FK FROM ModuleDiscussion WHERE Module_FK = ?", [params.Module_FK])
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

exports.Crud_insertMessage = (params) => {
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