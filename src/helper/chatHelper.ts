import { Server, Socket } from "socket.io";
import { IChatTemplate, IMessageSchema } from "../util/types/Interface/CollectionInterface";
import ChatRepository from "../repo/chatRepo";
import ChatService from "../service/chatService";
import TokenHelper from "./tokenHelper";
import { JwtPayload } from "jsonwebtoken";
import UtilHelper from "./utilHelper";


export function ChatHelper(io: Server) {

    const chatService = new ChatService()
    const chatRepo = new ChatRepository()
    const tokenHelper = new TokenHelper();
    const utilHelper = new UtilHelper();

    io.on("message", (data) => {
        console.log("New message arrrived");
    })

    io.on("connection", async (socket: Record<string, any>) => {


        const token = socket.handshake.query.token;
        console.log("The token is");
        console.log(token);


        if (token && typeof token == "string") {
            const tokenId = utilHelper.getTokenFromHeader(token);

            if (tokenId) {

                console.log("This is token");

                console.log(tokenId);

                const tokenValidity: string | false | JwtPayload = await tokenHelper.decodeJWTToken(tokenId.toString());
                console.log("Token validity");

                console.log(tokenValidity);

                if (tokenValidity && typeof tokenValidity == "object") {

                    const profile_id = tokenValidity.profile_id;

                    console.log("New connection established");
                    socket.on("join", (userId: string) => {
                        socket.userId = userId;
                        socket.join(userId);  // Add the socket to the user's room
                        console.log(`User ${userId} joined room.`);
                    });


                    socket.on("message", async (chat: IMessageSchema) => {

                        console.log("new message");
                        console.log(chat);

                        const findRoom = await chatRepo.findRoomById(chat.room_id);
                        if (findRoom) {
                            const toId = findRoom.profile_one == profile_id ? findRoom.profile_two : findRoom.profile_one;



                            if (toId) {
                                const message: IMessageSchema = {
                                    is_block: {
                                        status: findRoom.blocked.status,
                                        blocked_from: findRoom.blocked.blocked_from || null
                                    },
                                    msg: chat.msg,
                                    profile_id: tokenValidity.profile_id,
                                    room_id: chat.room_id,
                                    seen: false,
                                    timeline: chat.timeline
                                }
                                chatService.addMessage(chat.room_id, chat.msg, chat.profile_id);
                                if (!findRoom.blocked.status) {
                                    socket.to(toId).emit("new_message", message);
                                }
                            }
                        }

                    })
                } else {
                    console.log("Token type is invalid");
                }
            } else {
                console.log("Token not found wiht header");
            }
        } else {
            console.log("No token found");
        }
    })
}

export default ChatHelper