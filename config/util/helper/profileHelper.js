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

    }
}

module.exports = profileHelper;