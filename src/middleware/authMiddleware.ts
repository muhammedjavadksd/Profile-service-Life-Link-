
import { NextFunction, Response } from "express";
import { CustomRequest } from "../util/types/CustomeType";
import TokenHelper from "../helper/tokenHelper";
import { JwtPayload } from "jsonwebtoken";


class AuthMiddleware {

    tokenHelper;

    constructor() {
        this.isValidUser = this.isValidUser.bind(this)
        this.isValidAdmin = this.isValidAdmin.bind(this)
        this.tokenHelper = new TokenHelper();
    }

    async isValidUser(req: CustomRequest, res: Response, next: NextFunction) {
        const headers = req.headers;
        const authorization = headers.authorization;

        try {
            if (authorization) {
                const auth_data = authorization.split(" ");

                if (auth_data[0] == "Bearer") {
                    const token: string = auth_data[1];


                    const tokenValidity: string | false | JwtPayload = await this.tokenHelper.decodeJWTToken(token);
                    if (tokenValidity && typeof tokenValidity == "object") {
                        if (!req.context) {
                            req.context = {}
                        }

                        console.log(tokenValidity);

                        req.context.token = token;
                        req.context.user_id = tokenValidity.user_id;
                        req.context.profile_id = tokenValidity.profile_id;
                        req.context.email_id = tokenValidity.email

                        next()
                        return
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


    async isValidAdmin(req: CustomRequest, res: Response, next: NextFunction) {
        const headers = req.headers;

        if (headers.authorization && headers['authorization'].split(' ')[0] === 'Bearer') {
            if (!req.context) {
                req.context = {}
            }
            const token: string = headers.authorization.split(' ')[1]
            req.context.auth_token = token;
            const checkValidity: string | false | JwtPayload = await this.tokenHelper.checkTokenValidity(token)
            if (checkValidity && typeof checkValidity == "object") {

                if (checkValidity?.email) {
                    req.context.email_id = checkValidity?.email;
                    req.context.token = token;
                    req.context.user_id = checkValidity.id;
                    next()
                } else {
                    res.status(401).json({
                        status: false,
                        msg: "Authorization is failed"
                    })
                }
            } else {

                res.status(401).json({
                    status: false,
                    msg: "Authorization is failed"
                })
            }
        } else {
            res.status(401).json({
                status: false,
                msg: "Invalid auth attempt"
            })
        }
    }
}


export default AuthMiddleware