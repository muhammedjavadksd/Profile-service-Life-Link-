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
const ProfileDataProvider = require("../../communication/Provider/ProfileProvider");
class UserProfileController {
    constructor() {
        this.userProfileService = new userService_1.default();
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
                const updateEmailID = yield profileHelper.updateEmailAddress(new_email_id, user_id);
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
    catch(e) {
        console.log(e);
        res.status(500).json({
            status: false,
            msg: "Internal Server Error"
        });
    }
}
exports.default = UserProfileController;
const updateProfileController = {
    profilePictureUpdation: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user_id = req.context.user_id;
            const profilePicture = req.files.profile_picture;
            if (user_id && profilePicture) {
                const updateProfilePicture = yield profileHelper.updateProfilePicture(user_id, profilePicture);
                res.status(updateProfilePicture.statusCode).json({
                    status: updateProfilePicture.statusCode,
                    msg: updateProfilePicture.msg
                });
            }
            else {
                res.status(400).json({
                    status: false,
                    msg: "Please provide valid image"
                });
            }
        }
        catch (e) {
            res.status(500).json({
                status: 500,
                msg: "Internal Server Error"
            });
        }
    })
};
module.exports = updateProfileController;
const profileHelper = require("../../config/util/helper/profileHelper");
const validatingControler = {
    profileUpdateOTPSubmission: (req, res, next) => {
        try {
            const otp = req.body.otp_number;
            const allowedOtpTypes = ['EMAIL', 'PHONE'];
            const otp_type = req.body.otp_type;
            const user_id = req.context.user_id;
            if (user_id && otp && otp_type) {
                if (allowedOtpTypes.includes(otp_type)) {
                    profileHelper.validateUpdateProfileOTP(otp, otp_type, user_id).then((data) => {
                        res.status(data.statusCode).json({
                            status: data.status,
                            msg: data.msg
                        });
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            msg: "Something went wrong"
                        });
                    });
                }
                else {
                    res.status(400).json({
                        status: false,
                        msg: "OTP type is not allowed!"
                    });
                }
            }
            else {
                res.status(401).json({
                    status: false,
                    msg: "Authentication failed"
                });
            }
        }
        catch (e) {
            res.status(500).json({
                status: false,
                msg: "Internal Server Error"
            });
        }
    }
};
module.exports = validatingControler;
