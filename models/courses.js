const mysql = require("./config_sql");

exports.cRud_studentCourses = (params) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT C.Course_PK, C.Name, C.ImagePath FROM CourseGroup CG INNER JOIN Course C ON CG.Course_FK = C.Course_PK INNER JOIN User U ON CG.Student_FK = U.User_PK WHERE U.Email = ?", [params])
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