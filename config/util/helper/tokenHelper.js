
const jwt = require("jsonwebtoken");

let tokenHelper = {


    decodeJWTToken: async (token) => {

        console.log(process.env.JWT_SECRET);

        try {
            let tokenValidity = await jwt.verify(token, process.env.JWT_SECRET);
            return tokenValidity
        } catch (e) {
            console.log(e);
            return false
        }
    }
}

module.exports = tokenHelper;