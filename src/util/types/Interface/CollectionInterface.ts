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
    created_at: Date,
    attachment: string,
}

interface ITicketTemplate {
    ticket_id: string,
    profile_id: string,
    title: string,
    priority: TicketPriority,
    category: TicketCategory,
    status: TicketStatus,
    created_at: Date,
    updated_at: Date,
    chats: ITicketChat[]
}

interface IMessageSchema {
    timeline: string,
    msg: string,
    seen: boolean,
    is_block: boolean
    profile_id: string
}

interface IChatTemplate {
    chat_id: string,
    profile_one: string,
    profile_two: string,
    chat_started: Date,
    blocked: {
        status: boolean,
        blocked_from?: string
    },
}


interface IUserCollection extends Document, IUserProfile { };
interface ITicketCollection extends Document, ITicketTemplate { };
interface IChatCollection extends Document, IChatTemplate { };
interface IMessageCollection extends Document, IMessageSchema { };

export { IChatCollection, IMessageCollection, IMessageSchema, IChatTemplate, IProfileEdit, IUserEditProfile, IUserCollection, IUserProfile, ITicketTemplate, ITicketCollection, ITicketChat }
