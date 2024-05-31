
const jwt = require("jsonwebtoken");

let tokenHelper = {


    decodeJWTToken: async (token) => {

        try {
            let tokenValidity = await jwt.verify(token, process.env.BCRYPT_SECREY);
            return tokenValidity
        } catch (e) {
            console.log(e);
            return false
        }
    }
}

module.exports = tokenHelper;