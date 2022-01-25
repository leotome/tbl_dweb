const jwt = require("jsonwebtoken");

module.exports = {
    authenticateToken : function(headers) {
        authenticateToken(headers);
        return Helper_TokenData
    }
}

Helper_TokenData = null;

function authenticateToken(req) {
    const Authorization = req.headers["authorization"];
    const cookies = req.cookies;
    const token = (cookies !== null) ?  cookies.tbl_app : null;
    let payload = null;
    if(token !== null){
        payload = token;
    } else if(Authorization !== undefined){
        const token = Authorization && Authorization.split(" ")[1];
        payload = token;
    } else {
        Helper_TokenData = null;
        return null;
    }
    if(payload != null){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if(err){
                Helper_TokenData = null;
                return null;
            }
            Helper_TokenData = data;
            return data;
        });
    }
    return null;
}