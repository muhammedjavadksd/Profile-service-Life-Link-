// const { default: mongoose } = require("mongoose");
import mongoose, { Schema } from "mongoose"
import { IUserCollection, IUserProfile } from "../../util/types/Interface/CollectionInterface";

const userProfileScheme = {
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
            },
            otp: {
                type: Number,
            },
            otp_expire_time: {
                type: Number,
            }
        },
        phone_number: {
            new_phone_number: {
                type: String,
                required: false
            },
            otp: {
                type: Number,
            },
            otp_expire_time: {
                type: Number,
            }
        }
    },
    phone_number: {
        type: String,
        required: true
    },
    profile_id: {
        type: String,
        required: true,
        unique: true
    },
    blood_donor_id: {
        type: String,
    }
}

const schemeModel = new Schema<IUserCollection>(userProfileScheme);
const UserProfileModel = mongoose.model<IUserCollection>("user_profile", schemeModel, "user_profile");
export default UserProfileModel