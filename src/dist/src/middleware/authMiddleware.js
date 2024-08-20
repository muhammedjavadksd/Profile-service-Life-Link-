"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenHelper_1 = __importDefault(require("../helper/tokenHelper"));
class AuthMiddleware {
    constructor() {
        this.tokenHelper = new tokenHelper_1.default();
    }
    isValidUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = req.headers;
            const authorization = headers.authorization;
            try {
                if (authorization) {
                    const auth_data = authorization.split(" ");
                    if (auth_data[0] == "Bearer") {
                        const token = auth_data[1];
                        const tokenValidity = yield this.tokenHelper.decodeJWTToken(token);
                        if (tokenValidity && typeof tokenValidity == "object") {
                            if (!req.context) {
                                req.context = {};
                            }
                            req.context.token = token;
                            req.context.user_id = tokenValidity.user_id;
                            req.context.email_id = tokenValidity.email;
                            next();
                            return;
                        }
                    }
                }
                res.status(401).json({
                    status: false,
                    msg: "Authentication failed"
                });
            }
            catch (e) {
                console.log(e);
                res.status(500).json({
                    status: false,
                    msg: "Internal Server Error"
                });
            }
        });
    }
    isValidAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = req.headers;
            if (headers.authorization && headers['authorization'].split(' ')[0] === 'Bearer') {
                if (!req.context) {
                    req.context = {};
                }
                const token = headers.authorization.split(' ')[1];
                req.context.auth_token = token;
                const checkValidity = yield this.tokenHelper.checkTokenValidity(token);
                if (checkValidity && typeof checkValidity == "object") {
                    if (checkValidity === null || checkValidity === void 0 ? void 0 : checkValidity.email) {
                        req.context.email_id = checkValidity === null || checkValidity === void 0 ? void 0 : checkValidity.email;
                        req.context.token = token;
                        req.context.user_id = checkValidity.id;
                        next();
                    }
                    else {
                        res.status(401).json({
                            status: false,
                            msg: "Authorization is failed"
                        });
                    }
                }
                else {
                    res.status(401).json({
                        status: false,
                        msg: "Authorization is failed"
                    });
                }
            }
            else {
                res.status(401).json({
                    status: false,
                    msg: "Invalid auth attempt"
                });
            }
        });
    }
}
exports.default = AuthMiddleware;
