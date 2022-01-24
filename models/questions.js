const mysql = require("./config_sql");

exports.cRud_questionsByActivity = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            let query;
            if(params.Language == 'en'){
                query = "SELECT Question_PK, Language, Parent_FK, Statement, Answer1_Text, Answer1_Score, Answer2_Text, Answer2_Score, Answer3_Text, Answer3_Score, Answer4_Text, Answer4_Score, Answer5_Text, Answer5_Score FROM Question WHERE Language = ? AND Question_PK IN (SELECT Question_FK FROM ActivityQuestion WHERE Activity_FK = ?)";
            } else {
                query = "SELECT Question_PK, Language, Parent_FK, Statement, Answer1_Text, Answer1_Score, Answer2_Text, Answer2_Score, Answer3_Text, Answer3_Score, Answer4_Text, Answer4_Score, Answer5_Text, Answer5_Score FROM Question WHERE Language = ? AND Parent_FK IN (SELECT Question_FK FROM ActivityQuestion WHERE Activity_FK = ?)";
            }
            conn
            .query(query, [params.Language, params.Activity_FK])
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