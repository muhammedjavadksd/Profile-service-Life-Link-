const ProfileDataProvider = require("../../communication/Provider/ProfileProvider");
const profileHelper = require("../../config/util/helper/profileHelper");


let updateProfileController = {

    updateProfile: (req, res) => {

        console.log(req.context);

        let userProfile = req.body.user_profile;
        let user_id = req.context.user_id;
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

        let new_phone_number = req.body.new_phone_number;
        let user_id = req.context.user_id;

        try {
            if (new_phone_number && user_id) {
                console.log("New phone number is : " + new_phone_number);
                console.log("User id for the user :  " + user_id);

                let updatePhoneNumber = await profileHelper.updatePhoneNumber(new_phone_number, user_id);
                
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

            let new_email_id = req.body.new_email_id;
            let user_id = req.context.user_id;

            if (new_email_id && user_id) {
                let updateEmailID = await profileHelper.updateEmailAddress(new_email_id, user_id);
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

            let user_id = req.context.user_id;
            let profilePicture = req.files.profile_picture;

            if (user_id && profilePicture) {
                let updateProfilePicture = await profileHelper.updateProfilePicture(user_id, profilePicture);
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