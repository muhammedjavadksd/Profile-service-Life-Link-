
// const express = require("express");
import express from 'express';
import UserProfileController from '../controller/userController';
import AuthMiddleware from '../middleware/authMiddleware';

// const authMiddleware = require("../../middleware/authMiddleware");
const updateProfileController = require("../../controller/userController/updateProfile");
const validatingControler = require("../../controller/userController/validatingControler");
const userRouter = express.Router();

const userProfileController = new UserProfileController();
const authMiddleware = new AuthMiddleware();

userRouter.get("/get_profile", authMiddleware.isValidUser, userProfileController.getProfile)
userRouter.patch("/update_profile", authMiddleware.isValidUser, userProfileController.updateProfile)

userRouter.patch("/update_phone_number", authMiddleware.isValidUser, userProfileController.updatePhoneNumber)
userRouter.patch("/update_email_id", authMiddleware.isValidUser, updateProfileController.updateEmailID)
userRouter.patch("/profile_update_otp_submission", authMiddleware.isValidUser, validatingControler.profileUpdateOTPSubmission)
userRouter.patch("/update_profile_picture", authMiddleware.isValidUser, updateProfileController.profilePictureUpdation)


// module.exports = userRouter;
export default userRouter