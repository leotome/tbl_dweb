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
            .query("SELECT Module_PK, Name, Description, Course_FK, ImagePath FROM Module WHERE Module_PK = ? AND Course_FK = ?", [params.Module_PK, params.Course_FK])
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