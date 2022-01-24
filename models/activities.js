const mysql = require("./config_sql");

exports.cRud_activitiesByModule = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            let query;
            if(params.Language == 'en'){
                query = "SELECT Activity_PK, Module_FK, Title, Description, ImageURL, Language, Parent_FK FROM Activity WHERE Language = ? AND Activity_PK IN (SELECT Activity_PK FROM Activity WHERE Module_FK = ?)";
            } else {
                query = "SELECT Activity_PK, Module_FK, Title, Description, ImageURL, Language, Parent_FK FROM Activity WHERE Language = ? AND Parent_FK IN (SELECT Activity_PK FROM Activity WHERE Module_FK = ?)";
            }
            conn
            .query(query, [params.Language, params.Module_FK])
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

exports.cRud_activitiesByStudent = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT DISTINCT A.Activity_PK, A.Title, A.ImageURL, GS.Group_FK, GS.Student_FK FROM ActivityGroupStudent GS INNER JOIN ActivityGroup G ON GS.Group_FK = G.Group_PK INNER JOIN Activity A ON G.Activity_FK = A.Activity_PK WHERE GroupS.Student_FK = ?", [params])
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

exports.cRud_questionsByActivity = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .execute("SELECT A.Activity_PK, A.Title, Q.Question_PK, Q.Statement, Q.Answer1_Text, Q.Answer1_Score, Q.Answer2_Text, Q.Answer2_Score, Q.Answer3_Text, Q.Answer3_Score, Q.Answer4_Text, Q.Answer4_Score, Q.Answer5_Text, Q.Answer5_Score FROM ActivityQuestion ActQ INNER JOIN Activity A ON ActQ.Activity_FK = A.Activity_PK INNER JOIN Question Q ON ActQ.Question_FK = Q.Question_PK WHERE A.Activity_PK = ?", [params])
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