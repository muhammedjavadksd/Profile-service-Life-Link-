"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../service/userService"));
const UtilEnum_1 = require("../util/types/Enum/UtilEnum");
const chatService_1 = __importDefault(require("../service/chatService"));
class UserProfileController {
    constructor() {
        this.getProfile = this.getProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.updatePhoneNumber = this.updatePhoneNumber.bind(this);
        this.updateEmailID = this.updateEmailID.bind(this);
        this.profilePictureUpdation = this.profilePictureUpdation.bind(this);
        this.profileUpdateOTPSubmission = this.profileUpdateOTPSubmission.bind(this);
        this.createChat = this.createChat.bind(this);
        this.addMessageToChat = this.addMessageToChat.bind(this);
        this.blockStatus = this.blockStatus.bind(this);
        this.userProfileService = new userService_1.default();
        this.chatService = new chatService_1.default();
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const email_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.email_id;
            const findProfile = yield this.userProfileService.getSingleProfileByEmail(email_id); //profileHelper.getSingleProfile(email_id);
            res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data });
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userProfile = req.body.user_profile;
            if (!req.context) {
                res.status(UtilEnum_1.StatusCode.BAD_REQUEST).json({ status: false, msg: "Profile not found" });
                return;
            }
            const user_id = req.context.user_id;
            const updateProfile = yield this.userProfileService.updateProfile(userProfile, user_id);
            res.status(updateProfile.statusCode).json({ status: updateProfile.status, msg: updateProfile.msg, data: updateProfile.data });
        });
    }
    updatePhoneNumber(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const new_phone_number = req.body.new_phone_number;
            const user_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.user_id;
            if (new_phone_number && user_id) {
                const updatePhoneNumber = yield this.userProfileService.updatePhoneNumber(new_phone_number, user_id);
                res.status(updatePhoneNumber.statusCode).json({
                    status: updatePhoneNumber.status,
                    msg: updatePhoneNumber.msg
                });
            }
            else {
                res.status(UtilEnum_1.StatusCode.BAD_REQUEST).json({
                    status: false,
                    msg: "Please provide a phone number"
                });
            }
        });
    }
    updateEmailID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const new_email_id = req.body.new_email_id;
            const user_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.user_id;
            if (new_email_id && user_id) {
                const updateEmailID = yield this.userProfileService.updateEmailId(new_email_id, user_id);
                console.log(updateEmailID);
                res.status(updateEmailID.statusCode).json({
                    status: updateEmailID.status,
                    msg: updateEmailID.msg
                });
            }
            else {
                res.status(400).json({
                    status: false,
                    msg: "Please provide a phone number"
                });
            }
        });
    }
    profilePictureUpdation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //     const user_id = req.context?.user_id;
            //     const profilePicture = req.fil.profile_picture;
            //     if (user_id && profilePicture) {
            //         const updateProfilePicture = await profileHelper.updateProfilePicture(user_id, profilePicture);
            //         res.status(updateProfilePicture.statusCode).json({
            //             status: updateProfilePicture.statusCode,
            //             msg: updateProfilePicture.msg
            //         })
            //     } else {
            //         res.status(400).json({
            //             status: false,
            //             msg: "Please provide valid image"
            //         })
            //     }
            // } catch(e) {
            //     res.status(500).json({
            //         status: 500,
            //         msg: "Internal Server Error"
            //     })
            // }
        });
    }
    profileUpdateOTPSubmission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const otp = req.body.otp_number;
            const allowedOtpTypes = ['EMAIL', 'PHONE'];
            const otp_type = req.body.otp_type;
            const user_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.user_id;
            if (user_id && otp && otp_type) {
                if (allowedOtpTypes.includes(otp_type)) {
                    const validateOtp = yield this.userProfileService.validateUpdateProfileOTP(otp, otp_type, user_id);
                    res.status(validateOtp.statusCode).json({
                        status: validateOtp.status,
                        msg: validateOtp.msg
                    });
                }
                else {
                    res.status(UtilEnum_1.StatusCode.BAD_REQUEST).json({
                        status: false,
                        msg: "OTP type is not allowed!"
                    });
                }
            }
            else {
                res.status(UtilEnum_1.StatusCode.UNAUTHORIZED).json({
                    status: false,
                    msg: "Authentication failed"
                });
            }
        });
    }
    createChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = req.context;
            if (context) {
                const profile_id = context.profile_id;
                const second_profile = req.body.to_profile;
                const msg = req.body.msg;
                const createChat = yield this.chatService.startChat(profile_id, second_profile, msg);
                res.status(createChat.statusCode).json({ status: createChat.status, msg: createChat.msg, data: createChat.data });
            }
            else {
                res.status(UtilEnum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un authraized access", });
            }
        });
    }
    addMessageToChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = req.body.message;
            const room_id = req.params.room_id;
            const context = req.context;
            if (context) {
                const profile_id = context.profile_id;
                if (profile_id) {
                    const addMessage = yield this.chatService.addMessage(room_id, msg, profile_id);
                    res.status(addMessage.statusCode).json({ status: addMessage.status, msg: addMessage.msg, data: addMessage.data });
                    return;
                }
            }
            res.status(UtilEnum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un authraized access", });
        });
    }
    blockStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const room_id = req.params.room_id;
            const status = req.params.status;
            const context = req.context;
            if (context) {
                const profile_id = context.profile_id;
                if (profile_id) {
                    if (status == "block") {
                        const blockRoom = yield this.chatService.blockChat(room_id, profile_id);
                        res.status(blockRoom.statusCode).json({ status: blockRoom.status, msg: blockRoom.msg, data: blockRoom.data });
                        return;
                    }
                    else {
                        const blockRoom = yield this.chatService.unBlockChat(room_id, profile_id);
                        res.status(blockRoom.statusCode).json({ status: blockRoom.status, msg: blockRoom.msg, data: blockRoom.data });
                        return;
                    }
                }
            }
            res.status(UtilEnum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un authraized access", });
        });
    }
}
exports.default = UserProfileController;
