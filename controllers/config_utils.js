const jwt = require("jsonwebtoken");

module.exports = {
    authenticateToken : function(headers) {
        authenticateToken(headers);
        return Helper_TokenData
    }
}

Helper_TokenData = null;

function authenticateToken(headers) {
    const Authorization = headers["authorization"];
    if(Authorization !== undefined){
        const token = Authorization && Authorization.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if (err) {
                Helper_TokenData = null;
                return null;
            }
            Helper_TokenData = data.Email;
            return data.Email;
          });
    } else {
        Helper_TokenData = null;
        return null;
    }
}