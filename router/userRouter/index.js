
const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const updateProfileController = require("../../controller/userController/updateProfile");
const validatingControler = require("../../controller/userController/validatingControler");
const userRouter = express.Router();


userRouter.patch("/update_profile", authMiddleware.isValidUser, updateProfileController.updateProfile)
userRouter.patch("/update_phone_number", authMiddleware.isValidUser, updateProfileController.updatePhoneNumber)
userRouter.patch("/update_email_id", authMiddleware.isValidUser, updateProfileController.updateEmailID)
userRouter.patch("/profile_update_otp_submission", authMiddleware.isValidUser, validatingControler.profileUpdateOTPSubmission)
userRouter.patch("/update_profile_picture", authMiddleware.isValidUser, updateProfileController.profilePictureUpdation)


module.exports = userRouter;