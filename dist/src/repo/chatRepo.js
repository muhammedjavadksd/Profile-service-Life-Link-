"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChatsRoom_1 = __importDefault(require("../database/models/ChatsRoom"));
class ChatRepository {
    constructor() {
        this.chatCollection = ChatsRoom_1.default;
    }
    updateRoomByModel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield data.save();
            return true;
        });
    }
    findSingleChat(chat_id, profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const myChat = yield this.chatCollection.aggregate([{
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
            ]);
            console.log("My chats");
            // console.log(myChat[0].chat_person)
            // await this.chatCollection.findOne({
            //     $or: [{
            //         profile_one: profile_id,
            //     }, {
            //         profile_two: profile_id
            //     }]
            // });
            return myChat[0];
        });
    }
    findChatMyChat(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const myChat = yield this.chatCollection.aggregate([{
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
            ]);
            console.log("My chats");
            // console.log(myChat[0].chat_person)
            // await this.chatCollection.findOne({
            //     $or: [{
            //         profile_one: profile_id,
            //     }, {
            //         profile_two: profile_id
            //     }]
            // });
            return myChat;
        });
    }
    createChat(chat) {
        return __awaiter(this, void 0, void 0, function* () {
            const newChat = new this.chatCollection(chat);
            const insert = yield newChat.save();
            return insert.id;
        });
    }
    findRoomById(room_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield this.chatCollection.findOne({ chat_id: room_id });
            return find;
        });
    }
    blockChat(chat_id, profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newChat = yield this.chatCollection.findOne({ chat_id });
            if (newChat) {
                newChat.blocked.status = true;
                newChat.blocked.blocked_from = profile_id;
                yield this.updateRoomByModel(newChat);
                return true;
            }
            else {
                return false;
            }
        });
    }
    unBlockChat(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newChat = yield this.chatCollection.findOne({ chat_id });
            if (newChat) {
                newChat.blocked.status = false;
                yield this.updateRoomByModel(newChat);
                return true;
            }
            else {
                return false;
            }
        });
    }
    findChatById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findChat = yield this.chatCollection.findOne({ chat_id: id });
            return findChat;
        });
    }
    addMessageToChat(chatId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const addMessage = yield ChatsRoom_1.default.updateOne({ chat_id: chatId }, { $push: { chats: message } });
            return addMessage.modifiedCount > 0;
        });
    }
    addMessageDetails(room_id, details) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRoom = yield this.chatCollection.updateOne({ chat_id: room_id }, { $set: { messages: details } });
            return updateRoom.modifiedCount > 0;
        });
    }
}
exports.default = ChatRepository;
