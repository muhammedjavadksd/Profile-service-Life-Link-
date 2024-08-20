import { model } from "mongoose";
import { TicketChatFrom, TicketPriority, TicketStatus } from "../../util/types/Enum/UtilEnum";
import { ITicketCollection, ITicketTemplate } from "../../util/types/Interface/CollectionInterface";

const { Schema } = require("mongoose");

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
        required: false
    },
})

const ticketSchema = new Schema({
    ticket_id: {
        type: String,
        required: true
    },
    profie_id: {
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
        enum: Object.values(TicketPriority)
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(TicketStatus)
    },
    priority_number: {
        type: Number,
        required: true,
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