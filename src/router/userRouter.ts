
import express from 'express';
import UserProfileController from '../controller/userController';
import AuthMiddleware from '../middleware/authMiddleware';
import TicketController from '../controller/ticketController';

const userRouter = express.Router();

const userProfileController = new UserProfileController();
const authMiddleware = new AuthMiddleware();
const ticketController = new TicketController();

userRouter.get("/get_profile", authMiddleware.isValidUser, userProfileController.getProfile)
userRouter.get("/get_tickets/:page/:limit", authMiddleware.isValidUser, ticketController.listTickets)
userRouter.get("/get_tickets/:ticket_id", authMiddleware.isValidUser, ticketController.listTickets)
userRouter.get("/ticket-attachment-url", authMiddleware.isValidUser, ticketController.ticketAttachementUrl)

userRouter.post("/raise_ticket", authMiddleware.isValidUser, ticketController.createTicket)
userRouter.post("/create_chat", authMiddleware.isValidUser, userProfileController.createChat)
userRouter.post("/add_message/:room_id", authMiddleware.isValidUser, authMiddleware.isValidChat, userProfileController.addMessageToChat)
userRouter.post("/block-status/:status/:room_id", authMiddleware.isValidUser, authMiddleware.isValidChat, userProfileController.blockStatus)

userRouter.patch("/ticket_replay", authMiddleware.isValidUser, userProfileController.updateProfile)
userRouter.patch("/update_profile", authMiddleware.isValidUser, userProfileController.updateProfile)
userRouter.patch("/update_phone_number", authMiddleware.isValidUser, userProfileController.updatePhoneNumber)
userRouter.patch("/update_email_id", authMiddleware.isValidUser, userProfileController.updateEmailID)
userRouter.patch("/profile_update_otp_submission", authMiddleware.isValidUser, userProfileController.profileUpdateOTPSubmission)
userRouter.patch("/update_profile_picture", authMiddleware.isValidUser, userProfileController.profilePictureUpdation)

export default userRouter