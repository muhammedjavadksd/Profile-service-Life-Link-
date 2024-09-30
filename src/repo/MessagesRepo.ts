import { ObjectId } from "mongoose";
import { IMessageSchema } from "../util/types/Interface/CollectionInterface";
import MessagesCollection from "../database/models/Messages";


interface IMessageRepo {
    insertOne(data: IMessageSchema): Promise<ObjectId | null>
    updateSeen(chat_id: string): Promise<boolean>
}

class MessagesRepo implements IMessageRepo {


    async insertOne(data: IMessageSchema): Promise<ObjectId | null> {
        const instance = new MessagesCollection(data)
        const save = await instance.save();
        return save?.id
    }

    async updateSeen(room_id: string): Promise<boolean> {
        const findLastData = await MessagesCollection.findOne({ room_id }).sort({ timeline: -1 });
        console.log("Last data");

        console.log(findLastData);

        if (findLastData) {

            console.log(await MessagesCollection.findOne({ _id: findLastData?._id }));

            const updateSeen = await MessagesCollection.updateOne({ _id: findLastData?._id }, { $set: { seen: true } });
            console.log(updateSeen);

            return updateSeen.modifiedCount > 0
        } else {
            return false
        }
    }
}

export default MessagesRepo