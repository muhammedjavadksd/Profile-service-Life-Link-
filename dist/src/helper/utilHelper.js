"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(require("url"));
class UtilHelper {
    extractImageNameFromPresignedUrl(presigned_url) {
        try {
            const newUrl = url_1.default.parse(presigned_url, true);
            console.log("Presigned url");
            console.log(presigned_url);
            if (newUrl.pathname) {
                const pathName = newUrl.pathname.split("/");
                const path = `${pathName[1]}/${pathName[2]}`;
                return path;
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    }
    extractKeyNameFromPresignedUrl(presigned_url) {
        try {
            const newUrl = url_1.default.parse(presigned_url, true);
            if (newUrl.pathname) {
                const pathName = newUrl.pathname.split("/");
                const path = `${pathName[2]}`;
                return path;
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    }
    createOtpNumber(length) {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }
    createRandomText(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    getTokenFromHeader(headers) {
        const splitAuth = headers === null || headers === void 0 ? void 0 : headers.split(" ");
        if (splitAuth && splitAuth[0] == "Bearer") {
            const token = splitAuth[1];
            if (token) {
                return token;
            }
        }
        return false;
    }
}
exports.default = UtilHelper;
