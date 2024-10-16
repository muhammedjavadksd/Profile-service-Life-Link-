import { ObjectId } from "mongoose";
import ChatCollection from "../database/models/ChatsRoom";
import { IChatCollection, IChatMessageDetails, IChatTemplate, IMessageSchema } from "../util/types/Interface/CollectionInterface";

interface IChatRepo {
    createChat(chat: IChatTemplate): Promise<ObjectId | null>
    findChatById(id: string): Promise<IChatCollection | null>
    addMessageToChat(chatId: string, message: IMessageSchema): Promise<boolean>
    findChatMyChat(profile_id: string): Promise<IChatCollection[]>
    addMessageDetails(room_id: string, details: IChatMessageDetails): Promise<boolean>
    updateRoomByModel(data: IChatCollection): Promise<boolean>
    isRoomExist(profile_one: string, profile_two: string): Promise<string | false>
}


class ChatRepository implements IChatRepo {

    chatCollection;

    constructor() {
        this.chatCollection = ChatCollection;
    }


    async isRoomExist(profile_one: string, profile_two: string): Promise<string | false> {
        const findRoom = await this.chatCollection.findOne({
            $or: [
                {
                    $and: [
                        { profile_one },
                        { profile_two }
                    ]
                },
                {
                    $and: [
                        { profile_one: profile_two },
                        { profile_two: profile_one }
                    ]
                }
            ]
        })
        return findRoom?.chat_id || false
    }

    async updateRoomByModel(data: IChatCollection): Promise<boolean> {
        await data.save();
        return true
    }

    async findSingleChat(chat_id: string, profile_id: string): Promise<IChatCollection[]> {
        const myChat = await this.chatCollection.aggregate([{
            $match: {
                chat_id,
            },
        },
        {
            $addFields: {
                "chat_profile_id": {
                    $cond: {
                        if: { $eq: ['$profile_one', profile_id] },
                        then: "$profile_two",
                        else: "$profile_one"
                    }
                }
            }
        },
        {
            $lookup: {
                from: "user_profile",
                as: "chat_person",
                foreignField: "profile_id",
                localField: "chat_profile_id"
            }
        },
        {
            $lookup: {
                from: "messages",
                as: "chat_history",
                foreignField: "room_id",
                localField: "chat_id",
                pipeline: [
                    {
                        $match: {
                            $or: [
                                { 'is_block.status': false },
                                {
                                    $and: [
                                        { 'is_block.status': true },
                                        { 'is_block.blocked_from': { $ne: profile_id } }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        },
        { $unwind: '$chat_person' },
        {
            $project: {
                "_id": 0,
                "profile_one": 0,
                "profile_two": 0,
                "chat_person._id": 0,
                "chat_person.user_id": 0,
                "chat_person.email": 0,
                "chat_person.phone_number": 0,
            }
        }
        ])
        console.log("My chats");

        // console.log(myChat[0].chat_person)
        // await this.chatCollection.findOne({
        //     $or: [{
        //         profile_one: profile_id,
        //     }, {
        //         profile_two: profile_id
        //     }]
        // });
        return myChat[0]
    }

    async findChatMyChat(profile_id: string): Promise<IChatCollection[]> {

        console.log("The profile id is");
        console.log(profile_id)
        const myChat = await this.chatCollection.aggregate([{
            $match: {
                $or: [
                    {
                        profile_one: profile_id,
                    },
                    {
                        profile_two: profile_id
                    }
                ]
            },
        },
        {
            $addFields: {
                "chat_profile_id": {
                    $cond: {
                        if: { $eq: ['$profile_one', profile_id] },
                        then: "$profile_two",
                        else: "$profile_one"
                    }
                }
            }
        },
        {
            $lookup: {
                from: "user_profile",
                as: "chat_person",
                foreignField: "profile_id",
                localField: "chat_profile_id"
            }
        },
        { $unwind: '$chat_person' },
        {
            $project: {
                "_id": 0,
                "profile_one": 0,
                "profile_two": 0,
                "chat_person._id": 0,
                "chat_person.user_id": 0,
                "chat_person.email": 0,
                "chat_person.phone_number": 0,
            }
        }
        ])
        console.log("My chats");

        // console.log(myChat[0].chat_person)
        // await this.chatCollection.findOne({
        //     $or: [{
        //         profile_one: profile_id,
        //     }, {
        //         profile_two: profile_id
        //     }]
        // });
        return myChat
    }

    async createChat(chat: IChatTemplate): Promise<ObjectId | null> {
        const newChat = new this.chatCollection(chat);
        const insert = await newChat.save();
        return insert.id
    }

    async findRoomById(room_id: string): Promise<IChatCollection | null> {
        const find = await this.chatCollection.findOne({ chat_id: room_id });
        return find
    }

    async blockChat(chat_id: string, profile_id: string): Promise<boolean> {
        const newChat = await this.chatCollection.findOne({ chat_id });
        if (newChat) {
            newChat.blocked.status = true
            newChat.blocked.blocked_from = profile_id
            await this.updateRoomByModel(newChat);
            return true
        } else {
            return false
        }
    }


    async unBlockChat(chat_id: string): Promise<boolean> {
        const newChat = await this.chatCollection.findOne({ chat_id });
        if (newChat) {
            newChat.blocked.status = false
            await this.updateRoomByModel(newChat);
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

    async addMessageDetails(room_id: string, details: IChatMessageDetails): Promise<boolean> {
        const updateRoom = await this.chatCollection.updateOne({ chat_id: room_id }, { $set: { messages: details } })
        return updateRoom.modifiedCount > 0
    }
}

export default ChatRepository
