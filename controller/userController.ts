import { Request, Response } from "express";
import { CustomRequest } from "../util/types/CustomeType";
import UserProfileService from "../service/userService";

const { log } = require("forever");
const ProfileDataProvider = require("../../communication/Provider/ProfileProvider");
const profileHelper = require("../../config/util/helper/profileHelper");


class UserProfileController {

    userProfileService;

    constructor() {
        this.userProfileService = new UserProfileService();
    }

    async getProfile(req: CustomRequest, res: Response) {
        const email_id = req.context?.email_id;
        const findProfile = await this.userProfileService.getSingleProfileByEmail(email_id); //profileHelper.getSingleProfile(email_id);
        res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data })
    }
}

export default UserProfileController

const updateProfileController = {




    updateProfile: (req, res) => {

        console.log(req.context);

        const userProfile = req.body.user_profile;
        const user_id = req.context.user_id;
        console.log("User ID", user_id);
        console.log("User profile is :");
        console.log(userProfile);
        profileHelper.updateProfile(userProfile, user_id).then((data) => {
            ProfileDataProvider.updateAuthData({
                edit_details: {
                    ...userProfile,
                },
                profile_id: user_id
            })
            res.status(200).json({
                status: true,
                msg: "Profile has been updated"
            })
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                status: false,
                msg: "Internal Server Error"
            })
        })
    },

    updatePhoneNumber: async (req, res, next) => {

        const new_phone_number = req.body.new_phone_number;
        const user_id = req.context.user_id;

        try {
            if (new_phone_number && user_id) {
                console.log("New phone number is : " + new_phone_number);
                console.log("User id for the user :  " + user_id);

                const updatePhoneNumber = await profileHelper.updatePhoneNumber(new_phone_number, user_id);

                res.status(updatePhoneNumber.statusCode).json({
                    status: updatePhoneNumber.status,
                    msg: updatePhoneNumber.msg
                })
            } else {
                res.status(400).json({
                    status: false,
                    msg: "Please provide a phone number"
                })
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({
                status: false,
                msg: "Internal Server Error"
            })
        }
    },

    updateEmailID: async (req, res, next) => {

        try {

            const new_email_id = req.body.new_email_id;
            const user_id = req.context.user_id;

            if (new_email_id && user_id) {
                const updateEmailID = await profileHelper.updateEmailAddress(new_email_id, user_id);
                console.log(updateEmailID);
                res.status(updateEmailID.statusCode).json({
                    status: updateEmailID.status,
                    msg: updateEmailID.msg
                })
            } else {
                res.status(400).json({
                    status: false,
                    msg: "Please provide a phone number"
                })
            }

        } catch (e) {
            console.log(e);
            res.status(500).json({
                status: false,
                msg: "Internal Server Error"
            })
        }
    },

    profilePictureUpdation: async (req, res, next) => {

        try {

            const user_id = req.context.user_id;
            const profilePicture = req.files.profile_picture;

            if (user_id && profilePicture) {
                const updateProfilePicture = await profileHelper.updateProfilePicture(user_id, profilePicture);
                res.status(updateProfilePicture.statusCode).json({
                    status: updateProfilePicture.statusCode,
                    msg: updateProfilePicture.msg
                })
            } else {
                res.status(400).json({
                    status: false,
                    msg: "Please provide valid image"
                })
            }
        } catch (e) {
            res.status(500).json({
                status: 500,
                msg: "Internal Server Error"
            })
        }
    }


}

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
                        })
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            msg: "Something went wrong"
                        })
                    })
                } else {
                    res.status(400).json({
                        status: false,
                        msg: "OTP type is not allowed!"
                    })
                }
            } else {
                res.status(401).json({
                    status: false,
                    msg: "Authentication failed"
                })
            }
        } catch (e) {
            res.status(500).json({
                status: false,
                msg: "Internal Server Error"
            })
        }

    }
}

module.exports = validatingControler;