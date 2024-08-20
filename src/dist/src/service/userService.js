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
const userRepo_1 = __importDefault(require("../repo/userRepo"));
const UtilEnum_1 = require("../util/types/Enum/UtilEnum");
const ProfileProvider_1 = __importDefault(require("../communication/ProfileProvider"));
const utilHelper_1 = __importDefault(require("../helper/utilHelper"));
// const { default: mongoose } = require("mongoose");
// const ProfileDataProvider = require("../../../communication/Provider/ProfileProvider");
const constant_data = require("../../const/const");
const UserProfileModel = require("../../../database/models/UserProfile");
// const utilHelper = require("./utilHelper");
const path = require("path");
class UserProfileService {
    constructor() {
        this.userRepo = new userRepo_1.default();
    }
    createUser(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertUser = yield this.userRepo.insertProfile(profile);
            if (insertUser) {
                return {
                    msg: "User inserted success",
                    data: {
                        user_id: insertUser
                    },
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.CREATED
                };
            }
            else {
                return {
                    msg: "Something went wrong",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                };
            }
        });
    }
    getSingleProfileByEmail(email_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const singleProfile = yield this.userRepo.findProfileByEmailId(email_id); //await UserProfileModel.findOne({ email: email_id })
            if (singleProfile) {
                return {
                    msg: "Profile found",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK,
                    data: {
                        profile: singleProfile
                    }
                };
            }
            else {
                return {
                    msg: "Profile not found",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                };
            }
        });
    }
    updateProfile(data, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const edit_data = {
                first_name: data.first_name,
                last_name: data.last_name,
                profile_picture: data.profile_picture,
            };
            const updateProfile = yield this.userRepo.updateProfile(edit_data, user_id);
            if (updateProfile) {
                const profileCommunicationProvide = new ProfileProvider_1.default(process.env.AUTH_DATA_UPDATE_QUEUE || "");
                profileCommunicationProvide.transferData({ edit_details: Object.assign({}, edit_data), profile_id: user_id });
                // ProfileDataProvider.updateAuthData()
                return {
                    msg: "Profile update success",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK
                };
            }
            else {
                return {
                    msg: "Profile update failed",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUEST
                };
            }
        });
    }
    updatePhoneNumber(newPhoneNumber, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield this.userRepo.findUserByUserId(user_id); //await UserProfileModel.findOne({ user_id: user_id });
            if (findUser) {
                const utilHelper = new utilHelper_1.default();
                const otpNumber = utilHelper.createOtpNumber(6);
                const otpTimer = constant_data.MINIMUM_OTP_TIMER();
                const checkPhoneNumberUniques = yield this.userRepo.findUserByPhoneNumber(newPhoneNumber); // await UserProfileModel.findOne({ phone_number: newPhoneNumber });
                if (findUser.phone_number == newPhoneNumber) {
                    return {
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUEST,
                        status: false,
                        msg: "The new number you provided is the same as your current number."
                    };
                }
                if (checkPhoneNumberUniques) {
                    return {
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUEST,
                        status: false,
                        msg: "Phone number already exist"
                    };
                }
                findUser.contact_update.phone_number = {
                    new_phone_number: newPhoneNumber,
                    otp: otpNumber,
                    otp_expire_time: otpTimer
                };
                const profileDataProvide = new ProfileProvider_1.default(process.env.EMAIL_PROFILE_UPDATE_OTP || "");
                profileDataProvide.transferData({
                    email_id: findUser.email,
                    type: "PHONE",
                    otp: otpNumber,
                    full_name: (findUser.first_name + "  " + findUser.last_name)
                });
                yield this.userRepo.updateProfile({ contact_update: { phone_number: { new_phone_number: newPhoneNumber, otp: otpNumber, otp_expire_time: otpTimer } } }, user_id);
                return {
                    statusCode: UtilEnum_1.StatusCode.OK,
                    status: true,
                    msg: "OTP has been sent to mail"
                };
            }
            else {
                return {
                    statusCode: UtilEnum_1.StatusCode.UNAUTHORIZED,
                    status: false,
                    msg: "Authentication failed"
                };
            }
        });
    }
    updateEmailId(newEmailId, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield this.userRepo.findUserByUserId(user_id); //await UserProfileModel.findOne({ user_id: user_id });
            if (findUser) {
                const utilHelper = new utilHelper_1.default();
                const otpNumber = utilHelper.createOtpNumber(6);
                const otpTimer = constant_data.MINIMUM_OTP_TIMER();
                if (findUser.email == newEmailId) {
                    return {
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUEST,
                        status: false,
                        msg: "The new email address you provided is the same as your current email address."
                    };
                }
                const checkEmailUniquness = yield this.userRepo.findProfileByEmailId(newEmailId); //await UserProfileModel.findOne({ email: newEmailAddress });
                if (checkEmailUniquness) {
                    return {
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUEST,
                        status: false,
                        msg: "Email id already exist"
                    };
                }
                const profileProivider = new ProfileProvider_1.default(process.env.EMAIL_PROFILE_UPDATE_OTP || "");
                yield this.userRepo.updateProfile({ contact_update: { email: { new_email_id: newEmailId, otp: otpNumber, otp_expire_time: otpTimer } } }, user_id);
                profileProivider.transferData({
                    email_id: findUser.email,
                    type: "EMAIL",
                    otp: otpNumber,
                    full_name: (findUser.first_name + "  " + findUser.last_name)
                });
                return {
                    statusCode: UtilEnum_1.StatusCode.OK,
                    status: true,
                    msg: "OTP has been sent to mail"
                };
            }
            else {
                return {
                    statusCode: UtilEnum_1.StatusCode.UNAUTHORIZED,
                    status: false,
                    msg: "Authentication failed"
                };
            }
        });
    }
    validateUpdateProfileOTP(otp_number, type, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const userData = yield UserProfileModel.findOne({ user_id });
            if (userData) {
                if (type == UtilEnum_1.AuthUpdateType.Email) {
                    const userOTPNumber = (_a = userData.contact_update.email) === null || _a === void 0 ? void 0 : _a.otp; // userData.contact_update.email.otp;
                    const expireTime = +(((_b = userData.contact_update.email) === null || _b === void 0 ? void 0 : _b.otp_expire_time) || 0);
                    const newEmailID = (_c = userData.contact_update.email) === null || _c === void 0 ? void 0 : _c.new_email_id;
                    if (!userOTPNumber || !expireTime || !newEmailID) {
                        return {
                            statusCode: UtilEnum_1.StatusCode.BAD_REQUEST,
                            msg: "OTP not found",
                            status: false
                        };
                    }
                    //OTP correction checking
                    if (otp_number == userOTPNumber) {
                        //expire checking
                        if (expireTime > Date.now()) {
                            yield this.userRepo.updateProfile({ email: newEmailID, contact_update: {} }, user_id);
                            // await userData.save()
                            const provider = new ProfileProvider_1.default(process.env.AUTH_DATA_UPDATE_QUEUEs || "");
                            provider.transferData({
                                edit_details: { email: newEmailID },
                                profile_id: userData.user_id
                            });
                            return {
                                statusCode: UtilEnum_1.StatusCode.OK,
                                status: true,
                                msg: "Email id has been updated"
                            };
                        }
                        else {
                            return {
                                statusCode: UtilEnum_1.StatusCode.BAD_REQUEST,
                                status: false,
                                msg: "OTP time has been expired"
                            };
                        }
                    }
                    else {
                        return {
                            statusCode: UtilEnum_1.StatusCode.BAD_REQUEST,
                            status: false,
                            msg: "Incorrect OTP Number"
                        };
                    }
                }
                else {
                    const userOTPNumber = (_d = userData.contact_update.phone_number) === null || _d === void 0 ? void 0 : _d.otp;
                    const expireTime = +(((_e = userData.contact_update.phone_number) === null || _e === void 0 ? void 0 : _e.otp_expire_time) || 0);
                    const newPhoneNumber = (_f = userData.contact_update.phone_number) === null || _f === void 0 ? void 0 : _f.new_phone_number;
                    if (!userOTPNumber || !expireTime || !newPhoneNumber) {
                        return {
                            statusCode: UtilEnum_1.StatusCode.BAD_REQUEST,
                            msg: "OTP not found",
                            status: false
                        };
                    }
                    //OTP correction checking 
                    if (otp_number == userOTPNumber) {
                        if (expireTime > Date.now()) {
                            yield this.userRepo.updateProfile({ phone_number: newPhoneNumber, contact_update: {} }, user_id);
                            const provider = new ProfileProvider_1.default(process.env.AUTH_DATA_UPDATE_QUEUEs || "");
                            provider.transferData({
                                edit_details: {
                                    phone_number: Number(newPhoneNumber),
                                },
                                profile_id: userData.user_id
                            });
                            return {
                                statusCode: UtilEnum_1.StatusCode.OK,
                                status: true,
                                msg: "Phone number has been updated"
                            };
                        }
                        else {
                            return {
                                statusCode: UtilEnum_1.StatusCode.BAD_REQUEST,
                                status: false,
                                msg: "OTP time has been expired"
                            };
                        }
                    }
                    else {
                        return {
                            statusCode: UtilEnum_1.StatusCode.BAD_REQUEST,
                            status: false,
                            msg: "Incorrect OTP Number"
                        };
                    }
                }
            }
            else {
                return {
                    statusCode: UtilEnum_1.StatusCode.UNAUTHORIZED,
                    status: false,
                    msg: "Authentication failed"
                };
            }
        });
    }
}
exports.default = UserProfileService;
