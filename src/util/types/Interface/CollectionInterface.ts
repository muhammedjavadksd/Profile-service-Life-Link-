import { ObjectId, Document } from "mongoose"
import { TicketCategory, TicketChatFrom, TicketPriority, TicketStatus } from "../Enum/UtilEnum"

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

interface ITicketChat {
    chat_id: string,
    from: TicketChatFrom,
    text: string,
    created_at: string,
    attachment: string,
}

interface ITicketTemplate {
    ticket_id: string,
    profie_id: string,
    title: string,
    priority: TicketPriority,
    category: TicketCategory,
    status: TicketStatus,
    priority_number: number,
    created_at: Date,
    updated_at: Date,
    chats: ITicketChat[]
}

interface IUserCollection extends Document, IUserProfile { };
interface ITicketCollection extends Document, ITicketTemplate { };

export { IProfileEdit, IUserEditProfile, IUserCollection, IUserProfile, ITicketTemplate, ITicketCollection, ITicketChat }