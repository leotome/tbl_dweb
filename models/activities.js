const mysql = require("./config_sql");

exports.cRud_activitiesByModule = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT A.Activity_PK, A.Module_FK, A.Title, AT.ActivityType_PK, AT.ImagePath FROM Activity A INNER JOIN ActivityType AT ON A.Type_FK = AT.ActivityType_PK WHERE A.Module_FK = ?", [params.Module_FK])
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

exports.cRud_activitiesById = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            let query = '';
            if(params.Student_FK){
                query = `SELECT A.Activity_PK, A.Module_FK, A.Title, A.Type_FK, A.Description, A.Group_ParentActivity_FK, AD.ActivityDoneStudent_PK, AD.IsCompleted, AD.TotalScore FROM Activity A LEFT JOIN ActivityDoneStudent AD ON A.Activity_PK = AD.Activity_FK WHERE A.Activity_PK = ${params.Activity_PK} AND AD.Student_FK = ${params.Student_FK}`;
            } else {
                query = `SELECT A.Activity_PK, A.Module_FK, A.Title, A.Type_FK, A.Description, A.Group_ParentActivity_FK, AD.ActivityDoneStudent_PK, AD.IsCompleted, AD.TotalScore FROM Activity A LEFT JOIN ActivityDoneStudent AD ON A.Activity_PK = AD.Activity_FK WHERE A.Activity_PK = ${params.Activity_PK}`;
            }
            conn
            .query(query)
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

exports.cRud_noStudentsActivity = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            let query = '';
            if(params.Activity_PK){
                query = `SELECT A.Activity_PK, COUNT(CG.Student_FK) AS No_Students FROM CourseGroup CG INNER JOIN Module M ON CG.Course_FK = M.Course_FK INNER JOIN Activity A ON M.Module_PK = A.Module_FK WHERE Activity_PK = ${params.Activity_PK} GROUP BY A.Activity_PK`;
            } else {
                query = `SELECT A.Activity_PK, COUNT(CG.Student_FK) AS No_Students FROM CourseGroup CG INNER JOIN Module M ON CG.Course_FK = M.Course_FK INNER JOIN Activity A ON M.Module_PK = A.Module_FK GROUP BY A.Activity_PK`;
            }
            conn
            .query(query)
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

exports.cRud_noStudentsFinishedActivity = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            let query = '';
            if(params.Activity_PK){
                query = `SELECT Activity_FK, COUNT(Student_FK) AS No_Students FROM ActivityDoneStudent WHERE Activity_FK = ${params.Activity_PK} GROUP BY Activity_FK`;
            } else {
                query = `SELECT Activity_FK, COUNT(Student_FK) AS No_Students FROM ActivityDoneStudent GROUP BY Activity_FK`;
            }
            conn
            .query(query)
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