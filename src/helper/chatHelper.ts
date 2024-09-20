import { Server, Socket } from "socket.io";
import { IChatTemplate, IMessageSchema } from "../util/types/Interface/CollectionInterface";
import ChatRepository from "../repo/chatRepo";
import ChatService from "../service/chatService";
import TokenHelper from "./tokenHelper";
import { JwtPayload } from "jsonwebtoken";
import UtilHelper from "./utilHelper";


export function ChatHelper(io: Socket) {

    const chatService = new ChatService()
    const chatRepo = new ChatRepository()
    const tokenHelper = new TokenHelper();
    const utilHelper = new UtilHelper();


    io.on("connection", async (socket: Record<string, any>) => {

        console.log("New connection attemp");


        const token = socket.handshake.query.token;

        if (token && typeof token == "string") {
            const tokenId = utilHelper.getTokenFromHeader(token);

            if (tokenId) {
                const tokenValidity: string | false | JwtPayload = await tokenHelper.decodeJWTToken(token.toString());
                if (tokenValidity && typeof tokenValidity == "object") {

                    const profile_id = tokenValidity.profile_id;

                    console.log("New connection established");
                    // socket.on("join", (userId: string) => {
                    //     socket.userId = userId;
                    // })


                    socket.on("message", async (chat: IMessageSchema) => {
                        const findRoom = await chatRepo.findRoomById(chat.room_id);
                        if (findRoom) {
                            const toId = findRoom.profile_one == profile_id ? findRoom.profile_two : findRoom.profile_one;
                            if (toId) {
                                const message: IMessageSchema = {
                                    is_block: !!findRoom.blocked,
                                    msg: chat.msg,
                                    profile_id: tokenValidity.profile_id,
                                    room_id: chat.room_id,
                                    seen: false,
                                    timeline: chat.timeline
                                }
                                chatService.addMessage(chat.room_id, chat.msg, chat.profile_id);
                                socket.to(toId).emit("new_message", message);
                            }
                        }
                    })
                }
            }
        }

    })
}

export default ChatHelper