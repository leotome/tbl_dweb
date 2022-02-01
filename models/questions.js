const mysql = require("./config_sql");

exports.cRud_questionsByActivity = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .execute("SELECT Q.Question_PK, Q.Statement, Q.Answer1_Text, Q.Answer1_Score, Q.Answer2_Text, Q.Answer2_Score, Q.Answer3_Text, Q.Answer3_Score, Q.Answer4_Text, Q.Answer4_Score, Q.Answer5_Text, Q.Answer5_Score FROM Question Q WHERE Q.Question_PK IN (SELECT Question_FK FROM ActivityQuestion WHERE Activity_FK = ?)", [params.Activity_PK])
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

exports.cRud_questionsAnsweredByActivity = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .execute("SELECT A.Type_FK FROM Activity A WHERE A.Activity_PK = ?", [params.Activity_PK])
            .then(([Activity]) => {
                if(Activity.length > 0){
                    let query;
                    if(Activity[0].Type_FK == 1){
                        query = `SELECT Q.Question_PK, Q.Statement, Q.Answer1_Text, Q.Answer1_Score, Q.Answer2_Text, Q.Answer2_Score, Q.Answer3_Text, Q.Answer3_Score, Q.Answer4_Text, Q.Answer4_Score, Q.Answer5_Text, Q.Answer5_Score, ASt.Student_FK, ASt.Answer AS UserAnswer, ASt.Score FROM ActivityAnswerStudent ASt INNER JOIN Question Q ON ASt.Question_FK = Q.Question_PK WHERE ASt.Activity_FK = ${params.Activity_PK} AND ASt.Student_FK = ${params.Student_FK}`;
                    } else if(Activity[0].Type_FK == 2){
                        query = `SELECT Q.Question_PK, Q.Statement, Q.Answer1_Text, Q.Answer1_Score, Q.Answer2_Text, Q.Answer2_Score, Q.Answer3_Text, Q.Answer3_Score, Q.Answer4_Text, Q.Answer4_Score, Q.Answer5_Text, Q.Answer5_Score, ASt.Student_FK, ASt.Answer AS UserAnswer, ASt.Score FROM ActivityAnswerStudent ASt INNER JOIN Question Q ON ASt.Question_FK = Q.Question_PK WHERE ASt.Activity_FK = ${params.Activity_PK}`;
                    }
                    else {
                        reject('Please provide a valid Activity_PK.');
                    }
                    conn
                    .execute(query)
                    .then(([ActivityAnswerStudent]) => {
                        resolve(ActivityAnswerStudent);
                    })
                    .catch(error => {
                        reject(error.sqlMessage);
                    })
                } else {
                    reject('Please provide a valid Activity_PK.');
                }                
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

exports.cRud_allQuestions = () => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .execute("SELECT Q.Question_PK, Q.Statement, Q.Answer1_Text, Q.Answer1_Score, Q.Answer2_Text, Q.Answer2_Score, Q.Answer3_Text, Q.Answer3_Score, Q.Answer4_Text, Q.Answer4_Score, Q.Answer5_Text, Q.Answer5_Score FROM Question Q")
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