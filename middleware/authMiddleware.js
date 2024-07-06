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

                        console.log("The user");
                        console.log(tokenValidity);

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
    },


    isValidAdmin: async (req, res, next) => {
        let headers = req.headers;
        console.log("Admin headers");
        console.log(headers);

        if (headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            if (!req.context) {
                req.context = {}
            }
            let token = req.headers.authorization.split(' ')[1]
            req.context.auth_token = token;
            let checkValidity = await tokenHelper.checkTokenValidity(token)
            console.log(checkValidity);
            console.log(token);
            if (checkValidity) {
                console.log('Decode jwt is : ');
                console.log(checkValidity);

                if (checkValidity?.email) {
                    req.context.email_id = checkValidity?.email;
                    req.context.token = token;
                    req.context.user_id = checkValidity.id;
                    console.log("Requested phone number is", checkValidity?.email);
                    next()
                } else {
                    console.log("This error 1");
                    res.status(401).json({
                        status: false,
                        msg: "Authorization is failed"
                    })
                }
            } else {
                console.log("This error 2");

                res.status(401).json({
                    status: false,
                    msg: "Authorization is failed"
                })
            }
        } else {
            console.log("Headers");
            console.log(req.headers);
            console.log("This error 3");

            res.status(401).json({
                status: false,
                msg: "Invalid auth attempt"
            })
        }
    }
}

module.exports = authMiddleware;