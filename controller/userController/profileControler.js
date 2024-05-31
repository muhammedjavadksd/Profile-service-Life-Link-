const profileHelper = require("../../config/util/helper/profileHelper");


let userProfileController = {

    updateProfile: (req, res) => {

        let userProfile = req.body.user_profile;
        let user_id = req.context.user_id;
        profileHelper.updateProfile(userProfile, user_id).then((data) => {
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
    }
}

module.exports = userProfileController;