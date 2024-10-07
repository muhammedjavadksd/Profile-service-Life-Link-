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
const chatRepo_1 = __importDefault(require("../repo/chatRepo"));
const UtilEnum_1 = require("../util/types/Enum/UtilEnum");
const utilHelper_1 = __importDefault(require("../helper/utilHelper"));
const MessagesRepo_1 = __importDefault(require("../repo/MessagesRepo"));
const userRepo_1 = __importDefault(require("../repo/userRepo"));
class ChatService {
    constructor() {
        this.createChatId = this.createChatId.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.getMyChats = this.getMyChats.bind(this);
        this.blockChat = this.blockChat.bind(this);
        this.unBlockChat = this.unBlockChat.bind(this);
        this.startChat = this.startChat.bind(this);
        this.seenMessage = this.seenMessage.bind(this);
        this.userRepo = new userRepo_1.default();
        this.chatRepo = new chatRepo_1.default();
        this.messagesRepo = new MessagesRepo_1.default();
    }
    seenMessage(room_id, profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findChat = yield this.chatRepo.findRoomById(room_id);
            if ((findChat === null || findChat === void 0 ? void 0 : findChat.profile_one) == profile_id || (findChat === null || findChat === void 0 ? void 0 : findChat.profile_two) == profile_id) {
                findChat.messages.unseen_message_count = 0;
                yield this.chatRepo.updateRoomByModel(findChat);
                const updateMessage = yield this.messagesRepo.updateSeen(room_id);
                console.log("Update message");
                console.log(updateMessage);
                if (updateMessage) {
                    return {
                        msg: "Message seen status updated",
                        status: true,
                        statusCode: UtilEnum_1.StatusCode.OK
                    };
                }
                return {
                    msg: "Message seen status failed",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUEST
                };
            }
            else {
                return {
                    msg: "Un authraized access",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.UNAUTHORIZED
                };
            }
        });
    }
    createChatId() {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new utilHelper_1.default();
            let randomNumber = utilHelper.createOtpNumber(4);
            let randomText = utilHelper.createRandomText(4);
            let chat_id = randomText + randomNumber;
            let findChat = yield this.chatRepo.findChatById(chat_id);
            while (findChat) {
                randomNumber++;
                chat_id = randomText + randomNumber;
                findChat = yield this.chatRepo.findChatById(chat_id);
            }
            return chat_id;
        });
    }
    addMessage(room_id, msg, profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const findRoom = yield this.chatRepo.findChatById(room_id);
            if (findRoom) {
                if (((_a = findRoom.blocked) === null || _a === void 0 ? void 0 : _a.status) && findRoom.blocked.blocked_from == profile_id) {
                    return {
                        status: false,
                        msg: "Unblock them to send message",
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUEST
                    };
                }
                const unseen_message_count = findRoom.messages.unseen_message_count;
                const updateMessageDetails = {
                    last_message: msg,
                    last_message_from: profile_id,
                    unseen_message_count: unseen_message_count ? (unseen_message_count + 1) : 1
                };
                const message = {
                    room_id,
                    msg,
                    seen: false,
                    timeline: new Date(),
                    is_block: {
                        status: (_b = findRoom.blocked) === null || _b === void 0 ? void 0 : _b.status,
                        blocked_from: findRoom.blocked.blocked_from || null
                    },
                    profile_id: profile_id,
                };
                yield this.messagesRepo.insertOne(message);
                yield this.chatRepo.addMessageDetails(room_id, updateMessageDetails);
                // await this.chatRepo.
                return {
                    status: true,
                    msg: "Message added success",
                    statusCode: UtilEnum_1.StatusCode.CREATED
                };
            }
            else {
                return {
                    status: false,
                    msg: "Room not found",
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                };
            }
        });
    }
    getMyChats(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findMyChat = yield this.chatRepo.findChatMyChat(profile_id);
            if (findMyChat) {
                return {
                    statusCode: UtilEnum_1.StatusCode.OK,
                    status: true,
                    msg: "Chat fetched",
                    data: {
                        chats: findMyChat
                    }
                };
            }
            else {
                return {
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUEST,
                    status: false,
                    msg: "No chat found",
                };
            }
        });
    }
    blockChat(chat_id, profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockChat = yield this.chatRepo.blockChat(chat_id, profile_id);
            if (blockChat) {
                return {
                    msg: "Chat has been blocked",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK
                };
            }
            else {
                return {
                    msg: "Chat blocking failed",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUEST
                };
            }
        });
    }
    unBlockChat(chat_id, profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockChat = yield this.chatRepo.unBlockChat(chat_id);
            if (blockChat) {
                return {
                    msg: "Chat has been unblocked",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK
                };
            }
            else {
                return {
                    msg: "Chat unblocking failed",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUEST
                };
            }
        });
    }
    startChat(profile_one, profile_two, msg, via) {
        return __awaiter(this, void 0, void 0, function* () {
            if (via == UtilEnum_1.CreateChatVia.DonorId) {
                const findProfileByEmail = yield this.userRepo.findProfileByDonorId(profile_two);
                console.log(findProfileByEmail);
                console.log(profile_two);
                console.log("The docs");
                if (findProfileByEmail) {
                    profile_two = findProfileByEmail.profile_id.toString();
                }
                else {
                    return {
                        msg: "The profile is not active",
                        status: false,
                        statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                    };
                }
            }
            const checkRoom = yield this.chatRepo.isRoomExist(profile_one, profile_two);
            const chat_id = checkRoom || (yield this.createChatId());
            const messageScheme = {
                room_id: chat_id,
                is_block: {
                    status: false,
                    blocked_from: null
                },
                msg: msg,
                profile_id: profile_one,
                seen: false,
                timeline: new Date()
            };
            if (checkRoom) {
                yield this.messagesRepo.insertOne(messageScheme);
                return {
                    status: true,
                    msg: "Message has been sent",
                    statusCode: UtilEnum_1.StatusCode.CREATED,
                    data: {
                        chat_id
                    }
                };
            }
            else {
                const chat = {
                    chat_id,
                    chat_started: new Date(),
                    profile_one: profile_one,
                    profile_two: profile_two,
                    blocked: {
                        status: false
                    },
                    messages: {
                        last_message: msg,
                        last_message_from: profile_one,
                        unseen_message_count: 1
                    }
                };
                const saveChat = yield this.chatRepo.createChat(chat);
                if (saveChat) {
                    yield this.messagesRepo.insertOne(messageScheme);
                    return {
                        status: true,
                        msg: "Chat created success",
                        statusCode: UtilEnum_1.StatusCode.CREATED,
                        data: {
                            chat_id: saveChat
                        }
                    };
                }
                else {
                    return {
                        status: false,
                        msg: "Chat created failed",
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUEST,
                    };
                }
            }
        });
    }
    getSingleChat(chat_id, profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findChat = yield this.chatRepo.findSingleChat(chat_id, profile_id);
            console.log("Single Chat");
            console.log(chat_id, profile_id);
            console.log(findChat);
            if (findChat) {
                return {
                    status: true,
                    msg: "Chat found",
                    data: {
                        chat: findChat
                    },
                    statusCode: UtilEnum_1.StatusCode.OK
                };
            }
            else {
                return {
                    status: false,
                    msg: "No chat found",
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                };
            }
        });
    }
}
exports.default = ChatService;
