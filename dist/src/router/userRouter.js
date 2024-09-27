"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controller/userController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const ticketController_1 = __importDefault(require("../controller/ticketController"));
const userRouter = express_1.default.Router();
const userProfileController = new userController_1.default();
const authMiddleware = new authMiddleware_1.default();
const ticketController = new ticketController_1.default();
userRouter.get("/", (req, res) => {
    res.status(200).send("Welcome to profile service");
});
userRouter.get("/get_profile", authMiddleware.isValidUser, userProfileController.getProfile);
userRouter.get("/get-tickets/:page/:limit", authMiddleware.isValidUser, ticketController.listTickets);
userRouter.get("/get-tickets/:ticket_id", authMiddleware.isValidUser, ticketController.getSingleTicketById);
userRouter.get("/get_chat_rooms", authMiddleware.isValidUser, userProfileController.getMyChats);
userRouter.get("/get_chat/:room_id", authMiddleware.isValidUser, authMiddleware.isValidChat, userProfileController.getSingleChat);
userRouter.get("/presigned_url", authMiddleware.isValidUser, userProfileController.getPresignedUrl);
userRouter.post("/raise_ticket", authMiddleware.isValidUser, ticketController.createTicket);
userRouter.post("/create_chat", authMiddleware.isValidUser, userProfileController.createChat);
userRouter.post("/add_message/:room_id", authMiddleware.isValidUser, authMiddleware.isValidChat, userProfileController.addMessageToChat);
userRouter.patch("/block-status/:status/:room_id", authMiddleware.isValidUser, authMiddleware.isValidChat, userProfileController.blockStatus);
userRouter.patch("/ticket_replay/:ticket_id", authMiddleware.isValidUser, ticketController.replayToTicket);
userRouter.patch("/update_profile", authMiddleware.isValidUser, userProfileController.updateProfile);
userRouter.patch("/update_phone_number", authMiddleware.isValidUser, userProfileController.updatePhoneNumber);
userRouter.patch("/update_email_id", authMiddleware.isValidUser, userProfileController.updateEmailID);
userRouter.patch("/profile_update_otp_submission", authMiddleware.isValidUser, userProfileController.profileUpdateOTPSubmission);
userRouter.patch("/update_profile_picture", authMiddleware.isValidUser, userProfileController.profilePictureUpdation);
exports.default = userRouter;
