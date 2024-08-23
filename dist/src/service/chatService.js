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
class ChatService {
    constructor() {
        this.createChatId = this.createChatId.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.getMyChats = this.getMyChats.bind(this);
        this.blockChat = this.blockChat.bind(this);
        this.unBlockChat = this.unBlockChat.bind(this);
        this.startChat = this.startChat.bind(this);
        this.chatRepo = new chatRepo_1.default();
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
            var _a;
            const findRoom = yield this.chatRepo.findChatById(room_id);
            if (findRoom) {
                if (findRoom.blocked && findRoom.blocked.blocked_from == profile_id) {
                    return {
                        status: false,
                        msg: "Unblock them to send message",
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUEST
                    };
                }
                const message = {
                    msg,
                    seen: false,
                    timeline: new Date().toISOString(),
                    is_block: (_a = findRoom.blocked) === null || _a === void 0 ? void 0 : _a.status,
                    profile_id: profile_id
                };
                yield this.chatRepo.addMessageToChat(room_id, message);
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
    startChat(profile_one, profile_two, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat_id = yield this.createChatId();
            const chat = {
                chat_id,
                chat_started: new Date(),
                profile_one: profile_one,
                profile_two: profile_two,
                blocked: {
                    status: false
                }
            };
            const messageScheme = {
                is_block: false,
                msg: msg,
                profile_id: profile_one,
                seen: false,
                timeline: new Date().toISOString()
            };
            const saveChat = yield this.chatRepo.createChat(chat);
            if (saveChat) {
                yield this.chatRepo.addMessageToChat(chat_id, messageScheme);
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
        });
    }
}
exports.default = ChatService;
