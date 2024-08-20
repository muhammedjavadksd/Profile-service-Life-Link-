"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controller/userController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const userRouter = express_1.default.Router();
const userProfileController = new userController_1.default();
const authMiddleware = new authMiddleware_1.default();
userRouter.get("/get_profile", authMiddleware.isValidUser, userProfileController.getProfile);
userRouter.patch("/update_profile", authMiddleware.isValidUser, userProfileController.updateProfile);
userRouter.patch("/update_phone_number", authMiddleware.isValidUser, userProfileController.updatePhoneNumber);
userRouter.patch("/update_email_id", authMiddleware.isValidUser, userProfileController.updateEmailID);
userRouter.patch("/profile_update_otp_submission", authMiddleware.isValidUser, userProfileController.profileUpdateOTPSubmission);
userRouter.patch("/update_profile_picture", authMiddleware.isValidUser, userProfileController.profilePictureUpdation);
exports.default = userRouter;