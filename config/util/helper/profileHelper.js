const { default: mongoose } = require("mongoose");
const ProfileDataProvider = require("../../../communication/Provider/ProfileProvider");
const constant_data = require("../../const/const");
const UserProfileModel = require("../../db/models/UserProfile");
const utilHelper = require("./utilHelper");
const path = require("path")


const profileHelper = {

    insertUser: (profile) => {

        const model = new UserProfileModel(profile)
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

            const findUser = await UserProfileModel.findOne({ user_id: user_id });

            const otpNumber = utilHelper.createOtpNumber(6);
            const otpTimer = constant_data.MINIMUM_OTP_TIMER();

            if (findUser) {


                const checkPhoneNumberUniques = await UserProfileModel.findOne({ phone_number: newPhoneNumber });

                if (findUser.phone_number == newPhoneNumber) {
                    return {
                        statusCode: 400,
                        status: true,
                        msg: "The new number you provided is the same as your current number."
                    }
                }

                if (checkPhoneNumberUniques) {
                    return {
                        statusCode: 409,
                        status: true,
                        msg: "Phone number already exist"
                    }
                }
                findUser.contact_update.phone_number = {
                    new_phone_number: newPhoneNumber,
                    otp: otpNumber,
                    otp_expire_time: otpTimer
                }

                ProfileDataProvider.profileUpdateNotification(findUser.email, "PHONE", otpNumber, (findUser.first_name + "  " + findUser.last_name))


                await findUser.save();
                console.log("All done");
                return {
                    statusCode: 200,
                    status: true,
                    msg: "OTP has been sent to mail"
                }

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

            const findUser = await UserProfileModel.findOne({ user_id: user_id });

            const otpNumber = utilHelper.createOtpNumber(6);
            const otpTimer = constant_data.MINIMUM_OTP_TIMER();

            if (findUser) {


                if (findUser.email == newEmailAddress) {
                    return {
                        statusCode: 400,
                        status: true,
                        msg: "The new email address you provided is the same as your current email address."
                    }
                }
                const checkEmailUniquness = await UserProfileModel.findOne({ email: newEmailAddress });

                if (checkEmailUniquness) {
                    return {
                        statusCode: 409,
                        status: true,
                        msg: "Email id already exist"
                    }
                }


                findUser.contact_update.email = {
                    new_email_id: newEmailAddress,
                    otp: otpNumber,
                    otp_expire_time: otpTimer
                }

                ProfileDataProvider.profileUpdateNotification(newEmailAddress, "EMAIL", otpNumber, (findUser.first_name + "  " + findUser.last_name))

                await findUser.save()
                return {
                    statusCode: 200,
                    status: true,
                    msg: "OTP has been sent to mail"
                }

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

            const userData = await UserProfileModel.findOne({ user_id });
            if (userData) {

                if (type == "EMAIL") {
                    const userOTPNumber = userData.contact_update.email.otp;
                    const expireTime = userData.contact_update.email.otp_expire_time;
                    const newEmailID = userData.contact_update.email.new_email_id;

                    //OTP correction checking
                    if (otp_number == userOTPNumber) {
                        //expire checking


                        if (expireTime > Date.now()) {
                            userData.email = newEmailID;
                            userData.contact_update.email = {};
                            await userData.save()
                            ProfileDataProvider.updateAuthData({
                                edit_details: { email: newEmailID },
                                profile_id: userData.user_id
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
                    const userOTPNumber = userData.contact_update.phone_number.otp;
                    const expireTime = userData.contact_update.phone_number.otp_expire_time;
                    const newPhoneNumber = userData.contact_update.phone_number.new_phone_number;

                    //OTP correction checking

                    console.log("Original OTP is :");
                    if (otp_number == userOTPNumber) {
                        console.log("Current time is : " + Date.now());
                        console.log("Expire time is- : " + expireTime);


                        //expire checking
                        if (expireTime > Date.now()) {
                            userData.phone_number = Number(newPhoneNumber);
                            userData.contact_update.phone_number = {};
                            await userData.save()
                            ProfileDataProvider.updateAuthData({
                                edit_details: {
                                    phone_number: Number(newPhoneNumber),
                                },
                                profile_id: userData.user_id
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

            const findUser = await UserProfileModel.findOne({ user_id });
            if (findUser) {
                const randomText = utilHelper.createRandomText(4)
                const profilePictureName = findUser.last_name + randomText + newProfilePicture.name;

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
    },


    getProfileByIds: async (ids) => {

        console.log(ids);
        console.log("JSON data");
        const profileIds = JSON.parse(ids)
        console.log(profileIds);


        try {

            const objectIds = profileIds.map(id => new mongoose.Types.ObjectId(id));
            console.log(objectIds);

            const allUsers = await UserProfileModel.find({
                user_id: {
                    $in: objectIds
                }
            });

            console.log(allUsers);
            return allUsers;
        } catch (e) {
            console.log(e);
            return null;
        }
    },


    getSingleProfile: async (email_id) => {
        try {
            const singleProfile = await UserProfileModel.findOne({ email: email_id })
            return singleProfile;
        } catch (e) {
            return null;
        }
    },

    getSingleProfileByProfileId: async (profile_id) => {
        const singleProfile = await UserProfileModel.findOne({ profile_id });
        return singleProfile;
    }
}

module.exports = profileHelper;