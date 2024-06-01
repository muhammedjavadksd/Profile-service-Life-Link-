
const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const updateProfileController = require("../../controller/userController/updateProfile");
const userRouter = express.Router();


userRouter.patch("/update_profile", authMiddleware.isValidUser, updateProfileController.updateProfile)
userRouter.patch("/update_phone_number", authMiddleware.isValidUser, updateProfileController.updatePhoneNumber)
userRouter.patch("/update_email_id", authMiddleware.isValidUser, updateProfileController.updatePhoneNumber)


module.exports = userRouter;