"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UtilEnum_1 = require("../../util/types/Enum/UtilEnum");
const { Schema } = require("mongoose");
const ticketChatSchema = new Schema({
    chat_id: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true,
        enum: Object.values(UtilEnum_1.TicketChatFrom)
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
});
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
        enum: Object.values(UtilEnum_1.TicketPriority)
    },
    category: {
        type: String,
        required: true,
        enum: Object.values(UtilEnum_1.TicketCategory)
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(UtilEnum_1.TicketStatus)
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
});
const TicketModel = (0, mongoose_1.model)("tickets", ticketSchema, "tickets");
exports.default = TicketModel;
