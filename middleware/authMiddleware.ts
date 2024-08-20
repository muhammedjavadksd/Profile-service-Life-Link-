// const tokenHelper = require("../config/util/helper/tokenHelper");



const authMiddleware = {

    isValidUser: async (req, res, next) => {
        const headers = req.headers;
        const authorization = headers?.authorization;

        console.log("headers");
        console.log(headers);

        console.log(authorization);

        try {
            if (authorization) {
                const auth_data = authorization.split(" ");

                if (auth_data[0] == "Bearer") {
                    console.log("Have valid bearer");
                    const token = auth_data[1];
                    console.log(token);

                    const tokenValidity = await tokenHelper.decodeJWTToken(token);
                    console.log("Token decode");
                    console.log(tokenValidity);
                    if (tokenValidity) {
                        if (!req.context) {
                            req.context = {}
                        }

                        console.log("The user");
                        console.log(tokenValidity);

                        console.log("The token");
                        console.log(token);

                        req.context.token = token;
                        req.context.user_id = tokenValidity.user_id;
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
        const headers = req.headers;
        console.log("Admin headers");
        console.log(headers);

        if (headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            if (!req.context) {
                req.context = {}
            }
            const token = req.headers.authorization.split(' ')[1]
            req.context.auth_token = token;
            const checkValidity = await tokenHelper.checkTokenValidity(token)
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