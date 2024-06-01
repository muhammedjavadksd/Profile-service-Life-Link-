const UserProfileModel = require("../../db/models/UserProfile")

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
    }
}

module.exports = profileHelper;