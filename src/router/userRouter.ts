
import express from 'express';
import UserProfileController from '../controller/userController';
import AuthMiddleware from '../middleware/authMiddleware';
import TicketController from '../controller/ticketController';

const userRouter = express.Router();

const userProfileController = new UserProfileController();
const authMiddleware = new AuthMiddleware();
const ticketController = new TicketController();

userRouter.get("/get_profile", authMiddleware.isValidUser, userProfileController.getProfile)
userRouter.patch("/update_profile", authMiddleware.isValidUser, userProfileController.updateProfile)

userRouter.post("/raise_ticket", authMiddleware.isValidUser, ticketController.createTicket)

userRouter.patch("/update_phone_number", authMiddleware.isValidUser, userProfileController.updatePhoneNumber)
userRouter.patch("/update_email_id", authMiddleware.isValidUser, userProfileController.updateEmailID)
userRouter.patch("/profile_update_otp_submission", authMiddleware.isValidUser, userProfileController.profileUpdateOTPSubmission)
userRouter.patch("/update_profile_picture", authMiddleware.isValidUser, userProfileController.profilePictureUpdation)

export default userRouter