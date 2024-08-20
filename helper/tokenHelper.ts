import jwt from 'jsonwebtoken';

class TokenHelper {

    async decodeJWTToken(token: string) {
        try {
            const tokenValidity = await jwt.verify(token, process.env.JWT_SECRET || "");
            return tokenValidity
        } catch (e) {
            return false
        }
    }

    async checkTokenValidity(token: string) {
        try {
            const checkValidity = await jwt.verify(token, process.env.JWT_SECRET || "");
            return checkValidity
        } catch (e) {
            return false
        }
    }
}

export default TokenHelper

// module.exports = tokenHelper;