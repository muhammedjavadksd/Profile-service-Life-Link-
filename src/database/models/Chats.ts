import { model, Schema } from "mongoose";
import { IChatCollection } from "../../util/types/Interface/CollectionInterface";
// import { ChatFrom } from "../../Util/Types/Enum";
// import { IChatCollection } from "../../Util/Types/Interface/ModelInterface";

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
    }
})

const chatSchema = new Schema({
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
    chats: {
        type: [messageSchema],
        required: true
    }
})

const ChatCollection = model<IChatCollection>("chat", chatSchema)

export default ChatCollection