const mysql = require("./config_sql");

exports.cRud_modulesByCourse = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT M.Module_PK, M.Name, M.Description, M.Course_FK, M.ImagePath, COUNT(SA.ModuleCompleted_FK) AS Achievements FROM Module M LEFT JOIN StudentAchievement SA ON M.Module_PK = SA.ModuleCompleted_FK WHERE M.Module_PK IN (SELECT Module_PK FROM Module WHERE Course_FK = ?) GROUP BY M.Module_PK", [params.Course_FK])
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

exports.cRud_moduleById = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT M.Module_PK, M.Name, M.Description, M.Course_FK, M.ImagePath, COUNT(SA.ModuleCompleted_FK) AS Achievements FROM Module M LEFT JOIN StudentAchievement SA ON M.Module_PK = SA.ModuleCompleted_FK WHERE M.Module_PK = ? AND M.Course_FK = ? GROUP BY M.Module_PK", [params.Module_PK, params.Course_FK])
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

exports.cRud_moduleStudents = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT M.Module_PK, CG.Student_FK FROM CourseGroup CG INNER JOIN Module M ON CG.Course_FK = M.Course_FK WHERE M.Module_PK = ?", [params.Module_PK])
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

exports.cRud_allModules = () => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT M.Module_PK, M.Name, M.Description, M.Course_FK, M.ImagePath FROM Module M ORDER BY M.Module_PK ASC")
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

exports.cRud_allAchievements = () => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT CONCAT(U.FirstName, ' ', U.LastName) AS StudentName, M.Name, SA.Student_FK, SA.ModuleCompleted_FK, SA.CompletionDate FROM StudentAchievement SA INNER JOIN Module M ON SA.ModuleCompleted_FK = M.Module_PK INNER JOIN User U ON SA.Student_FK = U.User_PK ORDER BY SA.CompletionDate DESC")
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