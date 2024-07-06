const { default: mongoose } = require("mongoose");


let userProfileScheme = {
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true
    },
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
    profile_picture: {
        type: String,
        required: false
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
    contact_update: {
        email: {
            new_email_id: {
                type: String,
                required: false
            },
            otp: {
                type: Number,
                required: function () {
                    return this.email && this.new_email_id
                }
            },
            otp_expire_time: {
                type: Number,
                required: function () {
                    return this.email && this.new_email_id
                }
            }
        },
        phone_number: {
            new_phone_number: {
                type: String,
                required: false
            },
            otp: {
                type: Number,
                required: function () {
                    return this.phone_number && this.new_phone_number
                }
            },
            otp_expire_time: {
                type: Number,
                required: function () {
                    return this.phone_number && this.new_phone_number
                }
            }
        }
    },
    phone_number: {
        type: String,
        required: true
    },
    profile_id: {
        type: String,
        required: true
    },
}

let schemeModel = new mongoose.Schema(userProfileScheme);
let UserProfileModel = mongoose.model("user_profile", schemeModel, "user_profile");
module.exports = UserProfileModel;