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
            conn
            .query("SELECT A.Activity_PK, A.Module_FK, M.Course_FK, A.Title, A.Type_FK, AT.ImagePath, A.Description, A.Group_ParentActivity_FK FROM Activity A INNER JOIN ActivityType AT ON A.Type_FK = AT.ActivityType_PK INNER JOIN Module M ON A.Module_FK = M.Module_PK WHERE A.Activity_PK = ?", [params.Activity_PK])
            .then(([result]) => {
                return result;
            })
            .then((ActivityDB) => {
                conn
                .query("SELECT AD.ActivityDoneStudent_PK, AD.IsCompleted, AD.TotalScore FROM ActivityDoneStudent AD WHERE AD.Activity_FK = ? AND AD.Student_FK = ?", [params.Activity_PK, params.Student_FK])
                .then(([result]) => {
                    let full = {
                        Activity : ActivityDB,
                        ActivityDoneStudent : result
                    }
                    resolve(full);
                })
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

exports.cRud_numberOfStudentsActivity = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT 'AllStudents' AS Type, COUNT(CG.Student_FK) AS No_Students FROM CourseGroup CG INNER JOIN Module M ON CG.Course_FK = M.Course_FK INNER JOIN Activity A ON M.Module_PK = A.Module_FK WHERE Activity_PK = ? UNION SELECT 'StudentsFinishedActivity' AS Type, COUNT(Student_FK) AS No_Students FROM ActivityDoneStudent WHERE Activity_FK = ?", [params.Activity_PK, params.Activity_PK])
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

exports.Crud_activitySubmit = (ActivityDoneStudent, ActivityAnswersStudent) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("INSERT INTO ActivityDoneStudent (Activity_FK, Student_FK, IsCompleted, TotalScore) VALUES (?, ?, ?, ?)", [ActivityDoneStudent.Activity_FK, ActivityDoneStudent.Student_FK, ActivityDoneStudent.IsCompleted, ActivityDoneStudent.TotalScore])
            .then(([result_ActivityDoneStudent]) => {
                conn
                .query("INSERT INTO ActivityAnswerStudent (Activity_FK, Student_FK, Question_FK, Answer, Score) VALUES ?", [ActivityAnswersStudent.map(item => [item.Activity_FK, item.Student_FK, item.Question_FK, item.Answer, item.Score])])
                .then(([result_ActivityAnswerStudent]) => {
                    resolve([result_ActivityDoneStudent, result_ActivityAnswerStudent]);
                })
                .catch((error) => {
                    reject(error.sqlMessage);
                });
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