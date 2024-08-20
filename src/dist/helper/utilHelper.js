"use strict";
// import { UploadedFile } from "express-fileupload"; // Adjust this import if using a different file upload library
Object.defineProperty(exports, "__esModule", { value: true });
class UtilHelper {
    // Method to create an OTP number of a given length
    createOtpNumber(length) {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }
    // Method to create a random text string of a given length
    createRandomText(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
exports.default = UtilHelper;
