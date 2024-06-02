const ProfileDataProvider = require("../../../communication/Provider/ProfileProvider");
const UserProfileModel = require("../../db/models/UserProfile");
const utilHelper = require("./utilHelper");
let path = require("path")


let profileHelper = {

    insertUser: (profile) => {

        let model = new UserProfileModel(profile)
        model.save().then((data) => {
            console.log("Profile created success");
        }).catch((err) => {
            console.log("Profile insertion error");
            console.log(err);
        })
    },

    updateProfile: async (data, user_id) => {

        try {
            await UserProfileModel.updateOne({ user_id }, data);
            return true
        } catch (e) {
            console.log(e);
            return false
        }

    },

    updatePhoneNumber: async (newPhoneNumber, user_id) => {

        try {

            let findUser = await UserProfileModel.findOne({ user_id: user_id });

            let otpNumber = utilHelper.createOtpNumber(6);
            let otpTimer = constant_data.MINIMUM_OTP_TIMER;

            if (findUser) {

                findUser.contact_update.phone_number = {
                    new_phone_number: newPhoneNumber,
                    otp: otpNumber,
                    otp_expire_time: otpTimer
                }

                ProfileDataProvider.profileUpdateNotification(findUser.email, "PHONE", otpNumber, (findUser.first_name + "  " + findUser.last_name))


                findUser.save().then(() => {
                    return {
                        statusCode: 200,
                        status: true,
                        msg: "OTP has been sent to mail"
                    }
                })
            } else {
                return {
                    statusCode: 401,
                    status: false,
                    msg: "Authentication failed"
                }
            }
        } catch (e) {
            console.log(e);
            return {
                statusCode: 500,
                status: false,
                msg: "Something went wrong"
            }
        }
    },

    updateEmailAddress: async (newEmailAddress, user_id) => {
        try {

            let findUser = await UserProfileModel.findOne({ user_id: user_id });

            let otpNumber = utilHelper.createOtpNumber(6);
            let otpTimer = constant_data.MINIMUM_OTP_TIMER;

            if (findUser) {

                findUser.contact_update.email = {
                    new_email_id: newEmailAddress,
                    otp: otpNumber,
                    otp_expire_time: otpTimer
                }

                ProfileDataProvider.profileUpdateNotification(findUser.email, "EMAIL", otpNumber, (findUser.first_name + "  " + findUser.last_name))

                findUser.save().then(() => {
                    return {
                        statusCode: 200,
                        status: true,
                        msg: "OTP has been sent to mail"
                    }
                })
            } else {
                return {
                    statusCode: 401,
                    status: false,
                    msg: "Authentication failed"
                }
            }
        } catch (e) {
            console.log(e);
            return {
                statusCode: 500,
                status: false,
                msg: "Something went wrong"
            }
        }
    },


    validateUpdateProfileOTP: async (otp_number, type, user_id) => {

        try {

            let userData = await UserProfileModel.findOne({ user_id });
            if (userData) {

                if (type == "EMAIL") {
                    let userOTPNumber = userData.contact_update.email.otp;
                    let expireTime = userData.contact_update.email.otp_expire_time;
                    let newEmailID = userData.contact_update.email.new_email_id;

                    //OTP correction checking
                    if (otp_number == userOTPNumber) {
                        //expire checking
                        if (expireTime < new Date().getUTCMilliseconds()) {
                            userData.email = newEmailID;
                            userData.contact_update.email = {};
                            await userData.save()
                            ProfileDataProvider.updateAuthData({
                                email: newEmailID,
                                profile_id: userData.id
                            })
                            return {
                                statusCode: 200,
                                status: true,
                                msg: "Email id has been updated"
                            }
                        } else {
                            return {
                                statusCode: 410,
                                status: false,
                                msg: "OTP time has been expired"
                            }
                        }
                    } else {
                        return {
                            statusCode: 401,
                            status: false,
                            msg: "Incorrect OTP Number"
                        }
                    }
                } else {
                    let userOTPNumber = userData.contact_update.phone_number.otp;
                    let expireTime = userData.contact_update.phone_number.otp_expire_time;
                    let newPhoneNumber = userData.contact_update.phone_number.new_phone_number;

                    //OTP correction checking
                    if (otp_number == userOTPNumber) {
                        //expire checking
                        if (expireTime < new Date().getUTCMilliseconds()) {
                            userData.phone_number = newPhoneNumber;
                            userData.contact_update.phone_number = {};
                            await userData.save()
                            ProfileDataProvider.updateAuthData({
                                phone_number: newPhoneNumber,
                                profile_id: userData.id
                            })
                            return {
                                statusCode: 200,
                                status: true,
                                msg: "Phone number has been updated"
                            }
                        } else {
                            return {
                                statusCode: 410,
                                status: false,
                                msg: "OTP time has been expired"
                            }
                        }
                    } else {
                        return {
                            statusCode: 401,
                            status: false,
                            msg: "Incorrect OTP Number"
                        }
                    }
                }
            } else {
                return {
                    statusCode: 401,
                    status: false,
                    msg: "Authentication failed"
                }
            }
        } catch (e) {
            return {
                statusCode: 500,
                status: false,
                msg: "Internal Server Error"
            }
        }
    },

    updateProfilePicture: async (user_id, newProfilePicture) => {
        try {

            let findUser = await UserProfileModel.findOne({ user_id });
            if (findUser) {
                let randomText = utilHelper.createRandomText(4)
                let profilePictureName = findUser.last_name + randomText + newProfilePicture.name;

                utilHelper.moveFile(newProfilePicture, path.join(__dirname, "images/user_profile", profilePictureName), async () => {
                    findUser.profile_picture = profilePictureName
                    await findUser.save()
                    return {
                        status: true,
                        statusCode: 200,
                        msg: "Profile picture has been updated"
                    }
                }, (err) => {
                    console.log(err);
                    return {
                        status: false,
                        statusCode: 500,
                        msg: "Internal Server Error"
                    }
                })
            } else {
                return {
                    status: false,
                    statusCode: 400,
                    msg: "Authentication failed"
                }
            }
        } catch (e) {
            console.log(e);
            return {
                status: false,
                statusCode: 500,
                msg: "Internal Servor Error"
            }
        }
    }
}

module.exports = profileHelper;