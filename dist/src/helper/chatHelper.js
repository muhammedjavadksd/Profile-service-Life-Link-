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
exports.ChatHelper = ChatHelper;
const chatRepo_1 = __importDefault(require("../repo/chatRepo"));
const chatService_1 = __importDefault(require("../service/chatService"));
const tokenHelper_1 = __importDefault(require("./tokenHelper"));
const utilHelper_1 = __importDefault(require("./utilHelper"));
function ChatHelper(io) {
    const chatService = new chatService_1.default();
    const chatRepo = new chatRepo_1.default();
    const tokenHelper = new tokenHelper_1.default();
    const utilHelper = new utilHelper_1.default();
    io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        console.log("New connection attemp");
        const token = socket.handshake.query.token;
        if (token && typeof token == "string") {
            const tokenId = utilHelper.getTokenFromHeader(token);
            if (tokenId) {
                const tokenValidity = yield tokenHelper.decodeJWTToken(token.toString());
                if (tokenValidity && typeof tokenValidity == "object") {
                    const profile_id = tokenValidity.profile_id;
                    console.log("New connection established");
                    // socket.on("join", (userId: string) => {
                    //     socket.userId = userId;
                    // })
                    socket.on("message", (chat) => __awaiter(this, void 0, void 0, function* () {
                        const findRoom = yield chatRepo.findRoomById(chat.room_id);
                        if (findRoom) {
                            const toId = findRoom.profile_one == profile_id ? findRoom.profile_two : findRoom.profile_one;
                            if (toId) {
                                const message = {
                                    is_block: !!findRoom.blocked,
                                    msg: chat.msg,
                                    profile_id: tokenValidity.profile_id,
                                    room_id: chat.room_id,
                                    seen: false,
                                    timeline: chat.timeline
                                };
                                chatService.addMessage(chat.room_id, chat.msg, chat.profile_id);
                                socket.to(toId).emit("new_message", message);
                            }
                        }
                    }));
                }
            }
        }
    }));
}
exports.default = ChatHelper;
