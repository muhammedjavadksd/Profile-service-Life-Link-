import { ObjectId, Document } from "mongoose"

interface IContactUpdate {
    email?: {
        new_email_id: String
        otp: Number
        otp_expire_time: Number
    },
    phone_number?: {
        new_phone_number: Number
        otp: Number,
        otp_expire_time: Number
    }
}

interface IUserEditProfile {
    first_name?: String,
    last_name?: String,
    profile_picture?: String,
}

interface IProfileEdit {
    email?: String,
    first_name?: String,
    last_name?: String,
    profile_picture?: String,
    contact_update?: IContactUpdate,
    phone_number?: Number
    profile_id?: String
    blood_donor_id?: String
}

interface IUserProfile {
    user_id: ObjectId
    email: String,
    first_name: String,
    last_name: String,
    profile_picture: String,
    contact_update: IContactUpdate,
    phone_number: Number
    profile_id: String
    blood_donor_id: String
}

interface IUserCollection extends Document, IUserProfile { };

export { IProfileEdit, IUserEditProfile, IUserCollection, IUserProfile }
