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
    io.on("message", (data) => {
        console.log("New message arrrived");
    });
    io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        const token = socket.handshake.query.token;
        console.log("The token is");
        console.log(token);
        if (token && typeof token == "string") {
            const tokenId = utilHelper.getTokenFromHeader(token);
            if (tokenId) {
                console.log("This is token");
                console.log(tokenId);
                const tokenValidity = yield tokenHelper.decodeJWTToken(tokenId.toString());
                console.log("Token validity");
                console.log(tokenValidity);
                if (tokenValidity && typeof tokenValidity == "object") {
                    const profile_id = tokenValidity.profile_id;
                    console.log("New connection established");
                    socket.on("join", (userId) => {
                        socket.userId = userId;
                        socket.join(userId); // Add the socket to the user's room
                        console.log(`User ${userId} joined room.`);
                    });
                    socket.on("message", (chat) => __awaiter(this, void 0, void 0, function* () {
                        console.log("new message");
                        console.log(chat);
                        const findRoom = yield chatRepo.findRoomById(chat.room_id);
                        if (findRoom) {
                            const toId = findRoom.profile_one == profile_id ? findRoom.profile_two : findRoom.profile_one;
                            if (toId) {
                                const message = {
                                    is_block: {
                                        status: findRoom.blocked.status,
                                        blocked_from: findRoom.blocked.blocked_from || null
                                    },
                                    msg: chat.msg,
                                    profile_id: tokenValidity.profile_id,
                                    room_id: chat.room_id,
                                    seen: false,
                                    timeline: chat.timeline
                                };
                                const addMessage = yield chatService.addMessage(chat.room_id, chat.msg, chat.profile_id);
                                console.log(addMessage);
                                console.log("Blocked status");
                                console.log(findRoom.blocked.status);
                                if (!findRoom.blocked.status) {
                                    console.log("Trasnfer");
                                    console.log(toId);
                                    socket.to(toId).emit("new_message", message);
                                }
                            }
                        }
                    }));
                }
                else {
                    console.log("Token type is invalid");
                }
            }
            else {
                console.log("Token not found wiht header");
            }
        }
        else {
            console.log("No token found");
        }
    }));
}
exports.default = ChatHelper;
