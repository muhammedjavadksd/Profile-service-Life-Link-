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
    findChatMyChat(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const myChat = yield this.chatCollection.findOne({
                $or: [{
                        profile_one: profile_id,
                    }, {
                        profile_two: profile_id
                    }]
            });
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
    blockChat(chat_id, profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newChat = yield this.chatCollection.findById(chat_id);
            if (newChat) {
                newChat.blocked.status = true;
                newChat.blocked.blocked_from = profile_id;
                return true;
            }
            else {
                return false;
            }
        });
    }
    unBlockChat(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newChat = yield this.chatCollection.findById(chat_id);
            if (newChat) {
                newChat.blocked.status = false;
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
}
exports.default = ChatRepository;
