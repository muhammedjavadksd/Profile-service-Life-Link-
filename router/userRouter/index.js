
const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const userProfileController = require("../../controller/userController/profileControler");
const userRouter = express.Router();


userRouter.patch("/update_profile", authMiddleware.isValidUser, userProfileController.updateProfile)
userRouter.patch("/update_phone_number", authMiddleware.isValidUser, userProfileController.updatePhoneNumber)


module.exports = userRouter;