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
const ChatCollection = (0, mongoose_1.model)("messages", messageSchema);
exports.default = ChatCollection;
