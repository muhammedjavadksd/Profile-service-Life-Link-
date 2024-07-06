
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
    },

    checkTokenValidity: async (token) => {
        try {
            let checkValidity = await jwt.verify(token, process.env.JWT_SECRET);
            console.log("Token validity is : ");
            console.log(checkValidity);
            return checkValidity
        } catch (e) {
            return false
        }
    }
}

module.exports = tokenHelper;