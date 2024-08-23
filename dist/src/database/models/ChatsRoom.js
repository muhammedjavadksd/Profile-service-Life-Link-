"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    timeline: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        required: true
    },
    is_block: {
        type: Boolean,
        required: true
    },
    profile_id: {
        type: String,
        required: true
    }
});
const chatSchema = new mongoose_1.Schema({
    chat_id: {
        type: String,
        required: true,
        unique: true
    },
    profile_one: {
        type: String,
        required: true
    },
    profile_two: {
        type: String,
        required: true
    },
    chat_started: {
        type: String,
        default: new Date()
    },
    messages: {
        last_message: {
            type: String,
            required: true
        },
        last_message_from: {
            type: String,
            required: true
        },
        unseen_message_count: {
            type: Number,
            required: true
        }
    },
    blocked: {
        status: {
            type: Boolean,
            required: false
        },
        blocked_from: {
            type: String,
            required: function () {
                return this.status !== undefined;
            }
        }
    }
});
const ChatCollection = (0, mongoose_1.model)("chat_room", chatSchema);
exports.default = ChatCollection;
