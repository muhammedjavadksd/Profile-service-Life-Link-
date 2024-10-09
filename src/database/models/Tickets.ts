import { model, Schema } from "mongoose";
import { TicketCategory, TicketChatFrom, TicketPriority, TicketStatus } from "../../util/types/Enum/UtilEnum";
import { ITicketCollection, ITicketTemplate } from "../../util/types/Interface/CollectionInterface";


const ticketChatSchema = new Schema({
    chat_id: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true,
        enum: Object.values(TicketChatFrom)
    },
    text: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true
    },
    attachment: {
        type: String,
    },
})

const ticketSchema = new Schema({
    ticket_id: {
        type: String,
        required: true
    },
    profile_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true,
        enum: Object.values(TicketPriority)
    },
    category: {
        type: String,
        required: true,
        enum: Object.values(TicketCategory)
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(TicketStatus)
    },
    created_at: {
        type: Date,
        required: true,
    },
    updated_at: {
        type: Date,
        required: true,
    },
    chats: [
        {
            type: ticketChatSchema,
            required: true
        }
    ]
})



const TicketModel = model<ITicketCollection>("tickets", ticketSchema, "tickets");
export default TicketModel