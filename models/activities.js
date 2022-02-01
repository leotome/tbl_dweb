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
                .query(`SELECT AD.ActivityDoneStudent_PK, AD.IsCompleted, AD.TotalScore, IF(AD.Student_FK=${params.Student_FK},1,0) AS IsLoggedUser FROM ActivityDoneStudent AD WHERE AD.Activity_FK = ${params.Activity_PK}`)
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
                    this.cRud_checkModuleFinished({Activity_FK : ActivityDoneStudent.Activity_FK})
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
                            .query("INSERT INTO StudentAchievement (Student_FK, ModuleCompleted_FK) SELECT CG.Student_FK, M.Module_PK, NOW() FROM CourseGroup CG INNER JOIN Module M ON CG.Course_FK = M.Course_FK WHERE M.Module_PK IN (SELECT Module_FK FROM Activity WHERE Activity_PK = ?)", [ActivityDoneStudent.Activity_FK])
                            .then(([result_insert]) => {
                                resolve([result_ActivityDoneStudent, result_ActivityAnswerStudent, trigger_result, result_insert]);
                            })
                            .catch(error => {
                                reject(error.sqlMessage);
                            })
                        } else {
                            resolve([result_ActivityDoneStudent, result_ActivityAnswerStudent, trigger_result]);
                        }
                    })
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

exports.cRud_checkModuleFinished = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            let allStudents = `SELECT 'AllStudents' AS Type, COUNT(CG.Student_FK) AS Value FROM CourseGroup CG INNER JOIN Module M ON CG.Course_FK = M.Course_FK WHERE M.Module_PK IN (SELECT Module_FK FROM Activity WHERE Activity_PK = ${params.Activity_FK})`;
            let finishedActivities = `SELECT 'FinishedActivities' AS Type, COUNT(Student_FK) AS Value FROM ActivityDoneStudent WHERE Activity_FK = ${params.Activity_FK} OR (Activity_FK IN (SELECT Group_ParentActivity_FK FROM Activity WHERE Activity_PK = ${params.Activity_FK}))`;
            let discussionParticipations = `SELECT DISTINCT 'DiscussionParticipations' AS Type, COUNT(DISTINCT CreatedBy_FK) AS Value FROM ModuleDiscussion WHERE Module_FK IN (SELECT Module_FK FROM Activity WHERE Activity_PK = ${params.Activity_FK})`;
            let achievements = `SELECT DISTINCT 'Achievements' AS Type, COUNT(Student_FK) AS Value FROM StudentAchievement WHERE ModuleCompleted_FK IN (SELECT Module_FK FROM Activity WHERE Activity_PK = ${params.Activity_FK})`;
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

exports.cRud_allActivities = () => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT A.Activity_PK, A.Module_FK, A.Title, AT.ActivityType_PK, AT.ImagePath, AT.Name FROM Activity A INNER JOIN ActivityType AT ON A.Type_FK = AT.ActivityType_PK")
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