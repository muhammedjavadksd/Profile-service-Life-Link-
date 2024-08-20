"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require("express");
const express_1 = __importDefault(require("express"));
const authMiddleware = require("../../middleware/authMiddleware");
const updateProfileController = require("../../controller/userController/updateProfile");
const validatingControler = require("../../controller/userController/validatingControler");
const userRouter = express_1.default.Router();
userRouter.get("/get_profile", authMiddleware.isValidUser, updateProfileController.getProfile);
userRouter.patch("/update_profile", authMiddleware.isValidUser, updateProfileController.updateProfile);
userRouter.patch("/update_phone_number", authMiddleware.isValidUser, updateProfileController.updatePhoneNumber);
userRouter.patch("/update_email_id", authMiddleware.isValidUser, updateProfileController.updateEmailID);
userRouter.patch("/profile_update_otp_submission", authMiddleware.isValidUser, validatingControler.profileUpdateOTPSubmission);
userRouter.patch("/update_profile_picture", authMiddleware.isValidUser, updateProfileController.profilePictureUpdation);
// module.exports = userRouter;
exports.default = userRouter;
