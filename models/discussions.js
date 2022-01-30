const e = require("express");
const mysql = require("./config_sql");

exports.cRud_discussionsByModule = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT D.Discussion_PK, D.Module_FK, D.Body, D.CreatedDate, CONCAT(U.FirstName, ' ', U.LastName) AS CreatedByName, U.Email AS CreatedByEmail, COUNT(SA.ModuleCompleted_FK) AS Achievements FROM ModuleDiscussion D LEFT JOIN StudentAchievement SA ON D.Module_FK = SA.ModuleCompleted_FK INNER JOIN User U ON D.CreatedBy_FK = U.User_PK WHERE D.Module_FK = ? GROUP BY D.Discussion_PK, D.Module_FK ORDER BY D.CreatedDate DESC", [params.Module_FK])
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
                this.cRud_checkModuleFinished({Module_FK : params.Module_FK})
                .then(trigger_result => {
                    let result_allStudents = trigger_result.find(({Type}) => Type == 'AllStudents').Value;
                    let result_finishedActivities = trigger_result.find(({Type}) => Type == 'FinishedActivities').Value;
                    let result_discussionParticipations = trigger_result.find(({Type}) => Type == 'DiscussionParticipations').Value;
                    let result_achievements = trigger_result.find(({Type}) => Type == 'Achievements').Value;

                    let HasActivitiesFinished = (result_allStudents < result_finishedActivities);
                    let HasAllDiscussionParticipations = (result_allStudents == result_discussionParticipations);
                    let HasNotAchievements = (result_allStudents > result_achievements);
                    if(HasActivitiesFinished && HasAllDiscussionParticipations && HasNotAchievements){
                        conn
                        .query("INSERT INTO StudentAchievement (Student_FK, ModuleCompleted_FK) SELECT CG.Student_FK, M.Module_PK FROM CourseGroup CG INNER JOIN Module M ON CG.Course_FK = M.Course_FK WHERE M.Module_PK = ?", [params.Module_FK])
                        .then(([result_insert]) => {
                            resolve([result, result_insert]);
                        })
                        .catch(error => {
                            reject(error.sqlMessage);
                        })
                    } else {
                        resolve(result);
                    }
                })
                .catch(trigger_error => {
                    reject(trigger_error.sqlMessage);
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

exports.cRud_checkModuleFinished = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            let allStudents = `SELECT 'AllStudents' AS Type, COUNT(CG.Student_FK) AS Value FROM CourseGroup CG INNER JOIN Module M ON CG.Course_FK = M.Course_FK WHERE M.Module_PK = ${params.Module_FK}`;
            let finishedActivities = `SELECT 'FinishedActivities' AS Type, COUNT(Student_FK) AS Value FROM ActivityDoneStudent WHERE Activity_FK IN (SELECT Activity_PK FROM Activity WHERE Module_FK = ${params.Module_FK})`;
            let discussionParticipations = `SELECT DISTINCT 'DiscussionParticipations' AS Type, COUNT(DISTINCT CreatedBy_FK) AS Value FROM ModuleDiscussion WHERE Module_FK = ${params.Module_FK}`;
            let achievements = `SELECT DISTINCT 'Achievements' AS Type, COUNT(Student_FK) AS Value FROM StudentAchievement WHERE ModuleCompleted_FK = ${params.Module_FK}`;
            let unionKeyword = " UNION ";
            let query = allStudents + unionKeyword + finishedActivities + unionKeyword + discussionParticipations + unionKeyword + achievements;
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