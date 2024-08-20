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
// const { default: mongoose } = require("mongoose");
// const ProfileDataProvider = require("../../../communication/Provider/ProfileProvider");
const constant_data = require("../../const/const");
const UserProfileModel = require("../../../database/models/UserProfile");
const utilHelper = require("./utilHelper");
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
}
exports.default = UserProfileService;
// const profileHelper = {
//     // insertUser: (profile) => {
//     //     const model = new UserProfileModel(profile)
//     //     model.save().then((data) => {
//     //         console.log("Profile created success");
//     //     }).catch((err) => {
//     //         console.log("Profile insertion error");
//     //         console.log(err);
//     //     })
//     // },
//     updateProfile: async (data, user_id) => {
//         try {
//             await UserProfileModel.updateOne({ user_id }, data);
//             return true
//         } catch (e) {
//             console.log(e);
//             return false
//         }
//     },
//     updatePhoneNumber: async (newPhoneNumber, user_id) => {
//         try {
//             const findUser = await UserProfileModel.findOne({ user_id: user_id });
//             const otpNumber = utilHelper.createOtpNumber(6);
//             const otpTimer = constant_data.MINIMUM_OTP_TIMER();
//             if (findUser) {
//                 const checkPhoneNumberUniques = await UserProfileModel.findOne({ phone_number: newPhoneNumber });
//                 if (findUser.phone_number == newPhoneNumber) {
//                     return {
//                         statusCode: 400,
//                         status: true,
//                         msg: "The new number you provided is the same as your current number."
//                     }
//                 }
//                 if (checkPhoneNumberUniques) {
//                     return {
//                         statusCode: 409,
//                         status: true,
//                         msg: "Phone number already exist"
//                     }
//                 }
//                 findUser.contact_update.phone_number = {
//                     new_phone_number: newPhoneNumber,
//                     otp: otpNumber,
//                     otp_expire_time: otpTimer
//                 }
//                 ProfileDataProvider.profileUpdateNotification(findUser.email, "PHONE", otpNumber, (findUser.first_name + "  " + findUser.last_name))
//                 await findUser.save();
//                 console.log("All done");
//                 return {
//                     statusCode: 200,
//                     status: true,
//                     msg: "OTP has been sent to mail"
//                 }
//             } else {
//                 return {
//                     statusCode: 401,
//                     status: false,
//                     msg: "Authentication failed"
//                 }
//             }
//         } catch (e) {
//             console.log(e);
//             return {
//                 statusCode: 500,
//                 status: false,
//                 msg: "Something went wrong"
//             }
//         }
//     },
//     updateEmailAddress: async (newEmailAddress, user_id) => {
//         try {
//             const findUser = await UserProfileModel.findOne({ user_id: user_id });
//             const otpNumber = utilHelper.createOtpNumber(6);
//             const otpTimer = constant_data.MINIMUM_OTP_TIMER();
//             if (findUser) {
//                 if (findUser.email == newEmailAddress) {
//                     return {
//                         statusCode: 400,
//                         status: true,
//                         msg: "The new email address you provided is the same as your current email address."
//                     }
//                 }
//                 const checkEmailUniquness = await UserProfileModel.findOne({ email: newEmailAddress });
//                 if (checkEmailUniquness) {
//                     return {
//                         statusCode: 409,
//                         status: true,
//                         msg: "Email id already exist"
//                     }
//                 }
//                 findUser.contact_update.email = {
//                     new_email_id: newEmailAddress,
//                     otp: otpNumber,
//                     otp_expire_time: otpTimer
//                 }
//                 ProfileDataProvider.profileUpdateNotification(newEmailAddress, "EMAIL", otpNumber, (findUser.first_name + "  " + findUser.last_name))
//                 await findUser.save()
//                 return {
//                     statusCode: 200,
//                     status: true,
//                     msg: "OTP has been sent to mail"
//                 }
//             } else {
//                 return {
//                     statusCode: 401,
//                     status: false,
//                     msg: "Authentication failed"
//                 }
//             }
//         } catch (e) {
//             console.log(e);
//             return {
//                 statusCode: 500,
//                 status: false,
//                 msg: "Something went wrong"
//             }
//         }
//     },
//     validateUpdateProfileOTP: async (otp_number, type, user_id) => {
//         try {
//             const userData = await UserProfileModel.findOne({ user_id });
//             if (userData) {
//                 if (type == "EMAIL") {
//                     const userOTPNumber = userData.contact_update.email.otp;
//                     const expireTime = userData.contact_update.email.otp_expire_time;
//                     const newEmailID = userData.contact_update.email.new_email_id;
//                     //OTP correction checking
//                     if (otp_number == userOTPNumber) {
//                         //expire checking
//                         if (expireTime > Date.now()) {
//                             userData.email = newEmailID;
//                             userData.contact_update.email = {};
//                             await userData.save()
//                             ProfileDataProvider.updateAuthData({
//                                 edit_details: { email: newEmailID },
//                                 profile_id: userData.user_id
//                             })
//                             return {
//                                 statusCode: 200,
//                                 status: true,
//                                 msg: "Email id has been updated"
//                             }
//                         } else {
//                             return {
//                                 statusCode: 410,
//                                 status: false,
//                                 msg: "OTP time has been expired"
//                             }
//                         }
//                     } else {
//                         return {
//                             statusCode: 401,
//                             status: false,
//                             msg: "Incorrect OTP Number"
//                         }
//                     }
//                 } else {
//                     const userOTPNumber = userData.contact_update.phone_number.otp;
//                     const expireTime = userData.contact_update.phone_number.otp_expire_time;
//                     const newPhoneNumber = userData.contact_update.phone_number.new_phone_number;
//                     //OTP correction checking
//                     console.log("Original OTP is :");
//                     if (otp_number == userOTPNumber) {
//                         console.log("Current time is : " + Date.now());
//                         console.log("Expire time is- : " + expireTime);
//                         //expire checking
//                         if (expireTime > Date.now()) {
//                             userData.phone_number = Number(newPhoneNumber);
//                             userData.contact_update.phone_number = {};
//                             await userData.save()
//                             ProfileDataProvider.updateAuthData({
//                                 edit_details: {
//                                     phone_number: Number(newPhoneNumber),
//                                 },
//                                 profile_id: userData.user_id
//                             })
//                             return {
//                                 statusCode: 200,
//                                 status: true,
//                                 msg: "Phone number has been updated"
//                             }
//                         } else {
//                             return {
//                                 statusCode: 410,
//                                 status: false,
//                                 msg: "OTP time has been expired"
//                             }
//                         }
//                     } else {
//                         return {
//                             statusCode: 401,
//                             status: false,
//                             msg: "Incorrect OTP Number"
//                         }
//                     }
//                 }
//             } else {
//                 return {
//                     statusCode: 401,
//                     status: false,
//                     msg: "Authentication failed"
//                 }
//             }
//         } catch (e) {
//             return {
//                 statusCode: 500,
//                 status: false,
//                 msg: "Internal Server Error"
//             }
//         }
//     },
//     updateProfilePicture: async (user_id, newProfilePicture) => {
//         try {
//             const findUser = await UserProfileModel.findOne({ user_id });
//             if (findUser) {
//                 const randomText = utilHelper.createRandomText(4)
//                 const profilePictureName = findUser.last_name + randomText + newProfilePicture.name;
//                 utilHelper.moveFile(newProfilePicture, path.join(__dirname, "images/user_profile", profilePictureName), async () => {
//                     findUser.profile_picture = profilePictureName
//                     await findUser.save()
//                     return {
//                         status: true,
//                         statusCode: 200,
//                         msg: "Profile picture has been updated"
//                     }
//                 }, (err) => {
//                     console.log(err);
//                     return {
//                         status: false,
//                         statusCode: 500,
//                         msg: "Internal Server Error"
//                     }
//                 })
//             } else {
//                 return {
//                     status: false,
//                     statusCode: 400,
//                     msg: "Authentication failed"
//                 }
//             }
//         } catch (e) {
//             console.log(e);
//             return {
//                 status: false,
//                 statusCode: 500,
//                 msg: "Internal Servor Error"
//             }
//         }
//     },
//     getProfileByIds: async (ids) => {
//         console.log(ids);
//         console.log("JSON data");
//         const profileIds = JSON.parse(ids)
//         console.log(profileIds);
//         try {
//             const objectIds = profileIds.map(id => new mongoose.Types.ObjectId(id));
//             console.log(objectIds);
//             const allUsers = await UserProfileModel.find({
//                 user_id: {
//                     $in: objectIds
//                 }
//             });
//             console.log(allUsers);
//             return allUsers;
//         } catch (e) {
//             console.log(e);
//             return null;
//         }
//     },
//     getSingleProfileByProfileId: async (profile_id) => {
//         const singleProfile = await UserProfileModel.findOne({ profile_id });
//         return singleProfile;
//     }
// }
// module.exports = profileHelper;
