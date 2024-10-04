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
    blood_donor_id?: String,
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
    email: string,
    first_name: string,
    last_name: string,
    profile_picture: string,
    contact_update: IContactUpdate,
    phone_number: Number
    profile_id: string
    blood_donor_id: string
}

interface ITicketChat {
    chat_id: string,
    from: TicketChatFrom,
    text: string,
    created_at: Date,
    attachment: string | null,
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

interface IPopulatedTicketTemplate {
    ticket_id: string,
    profile_id: string,
    profile: IUserProfile
    title: string,
    priority: TicketPriority,
    category: TicketCategory,
    status: TicketStatus,
    created_at: Date,
    updated_at: Date,
    chats: ITicketChat[]
}

interface IMessageSchema {
    room_id: string,
    timeline: Date,
    msg: string,
    seen: boolean,
    is_block: {
        status: boolean,
        blocked_from: string | null
    },
    profile_id: string
}

interface IChatMessageDetails {
    last_message: string,
    last_message_from: string
    unseen_message_count: number
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
    messages: IChatMessageDetails
}


interface IUserCollection extends Document, IUserProfile { };
interface ITicketCollection extends Document, ITicketTemplate { };
interface IChatCollection extends Document, IChatTemplate { };
interface IMessageCollection extends Document, IMessageSchema { };

export { IChatCollection, IChatMessageDetails, IMessageCollection, IMessageSchema, IChatTemplate, IProfileEdit, IUserEditProfile, IUserCollection, IUserProfile, ITicketTemplate, ITicketCollection, ITicketChat, IPopulatedTicketTemplate }
