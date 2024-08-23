import { model, Schema } from "mongoose";
import { IChatCollection } from "../../util/types/Interface/CollectionInterface";



const messageSchema = new Schema({
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
})


const chatSchema = new Schema({
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
    blocked: {
        status: {
            type: Boolean,
            required: false
        },
        blocked_from: {
            type: String,
            required: function (this: { status: boolean | undefined }): boolean {
                return this.status !== undefined;
            }
        }
    }
})

const ChatCollection = model<IChatCollection>("chat_room", chatSchema)

export default ChatCollection