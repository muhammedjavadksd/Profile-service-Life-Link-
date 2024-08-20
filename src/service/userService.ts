import mongoose from "mongoose";
import UserRepo from "../repo/userRepo";
import { AuthUpdateType, StatusCode } from "../util/types/Enum/UtilEnum";
import { IUserCollection, IUserEditProfile, IUserProfile } from "../util/types/Interface/CollectionInterface";
import { HelperFunctionResponse } from "../util/types/Interface/UtilInterface";
import ProfileDataProvider from "../communication/ProfileProvider";
import UtilHelper from "../helper/utilHelper";

// const { default: mongoose } = require("mongoose");
// const ProfileDataProvider = require("../../../communication/Provider/ProfileProvider");
const constant_data = require("../../const/const");
const UserProfileModel = require("../../../database/models/UserProfile");
// const utilHelper = require("./utilHelper");
const path = require("path")


class UserProfileService {

    userRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    async createUser(profile: IUserProfile): Promise<HelperFunctionResponse> {
        const insertUser = await this.userRepo.insertProfile(profile)
        if (insertUser) {
            return {
                msg: "User inserted success",
                data: {
                    user_id: insertUser
                },
                status: true,
                statusCode: StatusCode.CREATED
            }
        } else {
            return {
                msg: "Something went wrong",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }


    async getSingleProfileByEmail(email_id: string): Promise<HelperFunctionResponse> {

        const singleProfile = await this.userRepo.findProfileByEmailId(email_id) //await UserProfileModel.findOne({ email: email_id })
        if (singleProfile) {
            return {
                msg: "Profile found",
                status: true,
                statusCode: StatusCode.OK,
                data: {
                    profile: singleProfile
                }
            }
        } else {
            return {
                msg: "Profile not found",
                status: false,
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }


    async updateProfile(data: IUserEditProfile, user_id: string): Promise<HelperFunctionResponse> {
        const edit_data: IUserEditProfile = {
            first_name: data.first_name,
            last_name: data.last_name,
            profile_picture: data.profile_picture,
        }

        const updateProfile = await this.userRepo.updateProfile(edit_data, user_id);
        if (updateProfile) {
            const profileCommunicationProvide = new ProfileDataProvider(process.env.AUTH_DATA_UPDATE_QUEUE || "");
            profileCommunicationProvide.transferData({ edit_details: { ...edit_data, }, profile_id: user_id })
            // ProfileDataProvider.updateAuthData()
            return {
                msg: "Profile update success",
                status: true,
                statusCode: StatusCode.OK
            }
        } else {
            return {
                msg: "Profile update failed",
                status: false,
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }

    async updatePhoneNumber(newPhoneNumber: number, user_id: string): Promise<HelperFunctionResponse> {

        const findUser: IUserCollection | null = await this.userRepo.findUserByUserId(user_id) //await UserProfileModel.findOne({ user_id: user_id });
        if (findUser) {

            const utilHelper = new UtilHelper()

            const otpNumber: number = utilHelper.createOtpNumber(6);
            const otpTimer: number = constant_data.MINIMUM_OTP_TIMER();

            const checkPhoneNumberUniques = await this.userRepo.findUserByPhoneNumber(newPhoneNumber) // await UserProfileModel.findOne({ phone_number: newPhoneNumber });

            if (findUser.phone_number == newPhoneNumber) {
                return {
                    statusCode: StatusCode.BAD_REQUEST,
                    status: false,
                    msg: "The new number you provided is the same as your current number."
                }
            }

            if (checkPhoneNumberUniques) {
                return {
                    statusCode: StatusCode.BAD_REQUEST,
                    status: false,
                    msg: "Phone number already exist"
                }
            }

            findUser.contact_update.phone_number = {
                new_phone_number: newPhoneNumber,
                otp: otpNumber,
                otp_expire_time: otpTimer
            }

            const profileDataProvide = new ProfileDataProvider(process.env.EMAIL_PROFILE_UPDATE_OTP || "");
            profileDataProvide.transferData({
                email_id: findUser.email,
                type: "PHONE",
                otp: otpNumber,
                full_name: (findUser.first_name + "  " + findUser.last_name)
            })

            await this.userRepo.updateProfile({ contact_update: { phone_number: { new_phone_number: newPhoneNumber, otp: otpNumber, otp_expire_time: otpTimer } } }, user_id);
            return {
                statusCode: StatusCode.OK,
                status: true,
                msg: "OTP has been sent to mail"
            }
        } else {
            return {
                statusCode: StatusCode.UNAUTHORIZED,
                status: false,
                msg: "Authentication failed"
            }
        }
    }


    async updateEmailId(newEmailId: string, user_id: string) {

        const findUser: IUserCollection | null = await this.userRepo.findUserByUserId(user_id) //await UserProfileModel.findOne({ user_id: user_id });

        if (findUser) {
            const utilHelper = new UtilHelper()
            const otpNumber: number = utilHelper.createOtpNumber(6);
            const otpTimer: number = constant_data.MINIMUM_OTP_TIMER();

            if (findUser.email == newEmailId) {
                return {
                    statusCode: StatusCode.BAD_REQUEST,
                    status: false,
                    msg: "The new email address you provided is the same as your current email address."
                }
            }

            const checkEmailUniquness = await this.userRepo.findProfileByEmailId(newEmailId); //await UserProfileModel.findOne({ email: newEmailAddress });
            if (checkEmailUniquness) {
                return {
                    statusCode: StatusCode.BAD_REQUEST,
                    status: false,
                    msg: "Email id already exist"
                }
            }

            const profileProivider = new ProfileDataProvider(process.env.EMAIL_PROFILE_UPDATE_OTP || "");
            await this.userRepo.updateProfile({ contact_update: { email: { new_email_id: newEmailId, otp: otpNumber, otp_expire_time: otpTimer } } }, user_id);
            profileProivider.transferData({
                email_id: findUser.email,
                type: "EMAIL",
                otp: otpNumber,
                full_name: (findUser.first_name + "  " + findUser.last_name)
            })

            return {
                statusCode: StatusCode.OK,
                status: true,
                msg: "OTP has been sent to mail"
            }

        } else {
            return {
                statusCode: StatusCode.UNAUTHORIZED,
                status: false,
                msg: "Authentication failed"
            }
        }
    }


    async validateUpdateProfileOTP(otp_number: number, type: AuthUpdateType, user_id: string): Promise<HelperFunctionResponse> {

        const userData: IUserCollection = await UserProfileModel.findOne({ user_id });
        if (userData) {
            if (type == AuthUpdateType.Email) {
                const userOTPNumber = userData.contact_update.email?.otp // userData.contact_update.email.otp;
                const expireTime: number | undefined = +(userData.contact_update.email?.otp_expire_time || 0);
                const newEmailID = userData.contact_update.email?.new_email_id;

                if (!userOTPNumber || !expireTime || !newEmailID) {
                    return {
                        statusCode: StatusCode.BAD_REQUEST,
                        msg: "OTP not found",
                        status: false
                    }
                }

                //OTP correction checking
                if (otp_number == userOTPNumber) {
                    //expire checking

                    if (expireTime > Date.now()) {
                        await this.userRepo.updateProfile({ email: newEmailID, contact_update: {} }, user_id);
                        // await userData.save()
                        const provider = new ProfileDataProvider(process.env.AUTH_DATA_UPDATE_QUEUEs || "");
                        provider.transferData({
                            edit_details: { email: newEmailID },
                            profile_id: userData.user_id
                        })
                        return {
                            statusCode: StatusCode.OK,
                            status: true,
                            msg: "Email id has been updated"
                        }
                    } else {
                        return {
                            statusCode: StatusCode.BAD_REQUEST,
                            status: false,
                            msg: "OTP time has been expired"
                        }
                    }
                } else {
                    return {
                        statusCode: StatusCode.BAD_REQUEST,
                        status: false,
                        msg: "Incorrect OTP Number"
                    }
                }
            } else {
                const userOTPNumber = userData.contact_update.phone_number?.otp;
                const expireTime: number | undefined = +(userData.contact_update.phone_number?.otp_expire_time || 0);
                const newPhoneNumber = userData.contact_update.phone_number?.new_phone_number;

                if (!userOTPNumber || !expireTime || !newPhoneNumber) {
                    return {
                        statusCode: StatusCode.BAD_REQUEST,
                        msg: "OTP not found",
                        status: false
                    }
                }
                //OTP correction checking 
                if (otp_number == userOTPNumber) {

                    if (expireTime > Date.now()) {
                        await this.userRepo.updateProfile({ phone_number: newPhoneNumber, contact_update: {} }, user_id);
                        const provider = new ProfileDataProvider(process.env.AUTH_DATA_UPDATE_QUEUEs || "");
                        provider.transferData({
                            edit_details: {
                                phone_number: Number(newPhoneNumber),
                            },
                            profile_id: userData.user_id
                        })
                        return {
                            statusCode: StatusCode.OK,
                            status: true,
                            msg: "Phone number has been updated"
                        }
                    } else {
                        return {
                            statusCode: StatusCode.BAD_REQUEST,
                            status: false,
                            msg: "OTP time has been expired"
                        }
                    }
                } else {
                    return {
                        statusCode: StatusCode.BAD_REQUEST,
                        status: false,
                        msg: "Incorrect OTP Number"
                    }
                }
            }
        } else {
            return {
                statusCode: StatusCode.UNAUTHORIZED,
                status: false,
                msg: "Authentication failed"
            }
        }
    }
}

export default UserProfileService
