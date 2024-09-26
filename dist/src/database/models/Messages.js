"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    room_id: {
        type: String,
        required: true
    },
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
const MessagesCollection = (0, mongoose_1.model)("messages", messageSchema);
exports.default = MessagesCollection;