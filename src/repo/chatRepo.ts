import { ObjectId } from "mongoose";
import ChatCollection from "../database/models/ChatsRoom";
import { IChatCollection, IChatTemplate, IMessageSchema } from "../util/types/Interface/CollectionInterface";

interface IChatRepo {
    createChat(chat: IChatTemplate): Promise<ObjectId | null>
    findChatById(id: string): Promise<IChatCollection | null>
    addMessageToChat(chatId: string, message: IMessageSchema): Promise<boolean>
    findChatMyChat(profile_id: string): Promise<IChatCollection | null>
}


class ChatRepository implements IChatRepo {

    chatCollection;

    constructor() {
        this.chatCollection = ChatCollection;
    }

    async findChatMyChat(profile_id: string): Promise<IChatCollection | null> {

        const myChat = await this.chatCollection.findOne({
            $or: [{
                profile_one: profile_id,
            }, {
                profile_two: profile_id
            }]
        });
        return myChat
    }

    async createChat(chat: IChatTemplate): Promise<ObjectId | null> {
        const newChat = new this.chatCollection(chat);
        const insert = await newChat.save();
        return insert.id
    }

    async blockChat(chat_id: string, profile_id: string): Promise<boolean> {
        const newChat = await this.chatCollection.findById(chat_id);
        if (newChat) {
            newChat.blocked.status = true
            newChat.blocked.blocked_from = profile_id
            return true
        } else {
            return false
        }
    }


    async unBlockChat(chat_id: string): Promise<boolean> {
        const newChat = await this.chatCollection.findById(chat_id);
        if (newChat) {
            newChat.blocked.status = false
            return true
        } else {
            return false
        }
    }


    async findChatById(id: string): Promise<IChatCollection | null> {
        const findChat = await this.chatCollection.findOne({ chat_id: id });
        return findChat;
    }

    async addMessageToChat(chatId: string, message: IMessageSchema): Promise<boolean> {
        const addMessage = await ChatCollection.updateOne({ chat_id: chatId }, { $push: { chats: message } });
        return addMessage.modifiedCount > 0
    }
}

export default ChatRepository
