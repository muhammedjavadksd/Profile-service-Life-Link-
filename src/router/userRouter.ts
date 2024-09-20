
import express from 'express';
import UserProfileController from '../controller/userController';
import AuthMiddleware from '../middleware/authMiddleware';
import TicketController from '../controller/ticketController';

const userRouter = express.Router();

const userProfileController = new UserProfileController();
const authMiddleware = new AuthMiddleware();
const ticketController = new TicketController();

userRouter.get("/get_profile", authMiddleware.isValidUser, userProfileController.getProfile)
userRouter.get("/get-tickets/:page/:limit", authMiddleware.isValidUser, ticketController.listTickets)
userRouter.get("/get-tickets/:ticket_id", authMiddleware.isValidUser, ticketController.getSingleTicketById)
// userRouter.get("/ticket-attachment-url", authMiddleware.isValidUser, ticketController.ticketAttachementUrl)
userRouter.get("/get_chat_rooms", authMiddleware.isValidUser, userProfileController.getMyChats)
userRouter.get("/get_chat/:room_id", authMiddleware.isValidUser, authMiddleware.isValidChat, userProfileController.getSingleChat)
userRouter.get("/presigned_url", authMiddleware.isValidUser, userProfileController.getPresignedUrl)

userRouter.post("/raise_ticket", authMiddleware.isValidUser, ticketController.createTicket)
userRouter.post("/create_chat", authMiddleware.isValidUser, userProfileController.createChat)
userRouter.post("/add_message/:room_id", authMiddleware.isValidUser, authMiddleware.isValidChat, userProfileController.addMessageToChat)

userRouter.patch("/block-status/:status/:room_id", authMiddleware.isValidUser, authMiddleware.isValidChat, userProfileController.blockStatus)
userRouter.patch("/ticket_replay/:ticket_id", authMiddleware.isValidUser, ticketController.replayToTicket)
userRouter.patch("/update_profile", authMiddleware.isValidUser, userProfileController.updateProfile)
userRouter.patch("/update_phone_number", authMiddleware.isValidUser, userProfileController.updatePhoneNumber)
userRouter.patch("/update_email_id", authMiddleware.isValidUser, userProfileController.updateEmailID)
userRouter.patch("/profile_update_otp_submission", authMiddleware.isValidUser, userProfileController.profileUpdateOTPSubmission)
userRouter.patch("/update_profile_picture", authMiddleware.isValidUser, userProfileController.profilePictureUpdation)

export default userRouter