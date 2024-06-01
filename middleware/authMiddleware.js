const tokenHelper = require("../config/util/helper/tokenHelper");


let authMiddleware = {

    isValidUser: async (req, res, next) => {
        let headers = req.headers;
        let authorization = headers?.authorization;

        try {
            if (authorization) {
                let auth_data = authorization.split(" ");

                if (auth_data[0] == "Bearer") {
                    console.log("Have valid bearer");
                    let token = auth_data[1];

                    let tokenValidity = await tokenHelper.decodeJWTToken(token);
                    console.log("Token decode");
                    console.log(tokenValidity);
                    if (tokenValidity) {
                        if (!req.context) {
                            req.context = {}
                        }

                        req.context.token = token;
                        req.context.user_id = tokenValidity.id;
                        req.context.email_id = tokenValidity.email

                        next()
                        return;
                    }
                }
            }
            res.status(401).json({
                status: false,
                msg: "Authentication failed"
            })
        } catch (e) {
            console.log(e);
            res.status(500).json({
                status: false,
                msg: "Internal Server Error"
            })
        }
    }
}

module.exports = authMiddleware;