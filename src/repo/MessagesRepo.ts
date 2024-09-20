import { ObjectId } from "mongoose";
import { IMessageSchema } from "../util/types/Interface/CollectionInterface";
import MessagesCollection from "../database/models/Messages";


interface IMessageRepo {
    insertOne(data: IMessageSchema): Promise<ObjectId | null>
}

class MessagesRepo implements IMessageRepo {


    async insertOne(data: IMessageSchema): Promise<ObjectId | null> {
        const instance = new MessagesCollection(data)
        const save = await instance.save();
        return save?.id
    }
}

export default MessagesRepo