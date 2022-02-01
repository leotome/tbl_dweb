const mysql = require("./config_sql");

exports.cRud_studentCourses = (data) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT C.Course_PK, C.Name, C.ImagePath FROM Course C WHERE C.Language = ? AND (C.Course_PK OR C.Parent_FK) IN (SELECT CG.Course_FK FROM CourseGroup CG INNER JOIN User U ON CG.Student_FK = U.User_PK WHERE U.Email = ?)", [data.Language, data.Email])
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

exports.cRud_courseById = (data) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT Course_PK, Name, ImagePath FROM Course WHERE Course_PK = ?", [data.Course_PK])
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

exports.cRud_allCourses = () => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .query("SELECT C.Course_PK, C.Name, C.ImagePath FROM Course C")
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

exports.Crud_createCourse = (data) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .execute("INSERT INTO Course (Course_PK, Name, ImagePath) VALUES (NULL,?,?)", [data.Name, data.ImagePath])
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

exports.crUd_updateCourse = (id, data) => {
    return new Promise((resolve, reject) => {
        mysql.connect()
        .then((conn) => {
            conn
            .execute("UPDATE Course SET Name = ?, ImagePath = ? WHERE Course_PK = ?", [data.Name, data.ImagePath, id])
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