import { model, Schema } from "mongoose";
import { IChatCollection, IMessageCollection } from "../../util/types/Interface/CollectionInterface";

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



const ChatCollection = model<IMessageCollection>("messages", messageSchema)

export default ChatCollection