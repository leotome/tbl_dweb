const mysql = require("./config_sql");

exports.cRud_allActivities = () => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT Activity_PK, Title FROM Activity")
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