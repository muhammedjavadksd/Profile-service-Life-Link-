const { default: mongoose } = require("mongoose");


let userProfileScheme = {

    email: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    location: {
        type: {
            latitude: {
                type: mongoose.Types.Decimal128,
                required: true
            },
            longitude: {
                type: mongoose.Types.Decimal128,
                required: true
            }
        },
        required: false
    },
    phone_number: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
}

let schemeModel = new mongoose.Schema(userProfileScheme);
let UserProfileModel = mongoose.model("user_profile", schemeModel, "user_profile");
module.exports = UserProfileModel;