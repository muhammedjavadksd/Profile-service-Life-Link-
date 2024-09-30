import { model, Schema } from "mongoose";
import { IChatCollection, IMessageCollection } from "../../util/types/Interface/CollectionInterface";

const BlockSchema = new Schema({
    status: {
        type: Boolean,
        required: true
    },
    blocked_from: {
        type: String,
    }
})

const messageSchema = new Schema({
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
        type: BlockSchema,
        required: true
    },
    profile_id: {
        type: String,
        required: true
    }
})



const MessagesCollection = model<IMessageCollection>("messages", messageSchema)

export default MessagesCollection