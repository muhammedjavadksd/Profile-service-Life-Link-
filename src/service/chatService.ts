import { ObjectId } from "mongoose";
import ChatRepository from "../repo/chatRepo";
import { HelperFunctionResponse } from "../util/types/Interface/UtilInterface";
import { CreateChatVia, StatusCode } from "../util/types/Enum/UtilEnum";
import { IChatMessageDetails, IChatTemplate, IMessageSchema } from "../util/types/Interface/CollectionInterface";
import UtilHelper from "../helper/utilHelper";
import MessagesRepo from "../repo/MessagesRepo";
import UserRepo from "../repo/userRepo";


interface IChatService {
    getMyChats(profile_id: string): Promise<HelperFunctionResponse>
    addMessage(room_id: string, msg: string, profile_id: string): Promise<HelperFunctionResponse>
    seenMessage(room_id: string, profile_id: string): Promise<HelperFunctionResponse>
    startChat(profile_one: string, profile_two: string, msg: string, via: CreateChatVia): Promise<HelperFunctionResponse>
}

class ChatService implements IChatService {

    chatRepo;
    messagesRepo;
    userRepo;

    constructor() {
        this.createChatId = this.createChatId.bind(this)
        this.addMessage = this.addMessage.bind(this)
        this.getMyChats = this.getMyChats.bind(this)
        this.blockChat = this.blockChat.bind(this)
        this.unBlockChat = this.unBlockChat.bind(this)
        this.startChat = this.startChat.bind(this)
        this.seenMessage = this.seenMessage.bind(this)
        this.userRepo = new UserRepo()
        this.chatRepo = new ChatRepository();
        this.messagesRepo = new MessagesRepo()
    }

    async seenMessage(room_id: string, profile_id: string): Promise<HelperFunctionResponse> {
        const findChat = await this.chatRepo.findRoomById(room_id);
        if (findChat?.profile_one == profile_id || findChat?.profile_two == profile_id) {

            if (findChat.messages.last_message_from != profile_id) {
                findChat.messages.unseen_message_count = 0
                await this.chatRepo.updateRoomByModel(findChat);
                const updateMessage = await this.messagesRepo.updateSeen(room_id);
                if (updateMessage) {
                    return {
                        msg: "Message seen status updated",
                        status: true,
                        statusCode: StatusCode.OK
                    }
                }
            } else {
                return {
                    msg: "No unseen messages",
                    status: true,
                    statusCode: StatusCode.OK
                }
            }



            return {
                msg: "Message seen status failed",
                status: false,
                statusCode: StatusCode.BAD_REQUEST
            }
        } else {
            return {
                msg: "Un authraized access",
                status: false,
                statusCode: StatusCode.UNAUTHORIZED
            }
        }
    }


    async createChatId() {
        const utilHelper = new UtilHelper();
        let randomNumber: number = utilHelper.createOtpNumber(4);
        let randomText: string = utilHelper.createRandomText(4);
        let chat_id = randomText + randomNumber;
        let findChat = await this.chatRepo.findChatById(chat_id);
        while (findChat) {
            randomNumber++
            chat_id = randomText + randomNumber;
            findChat = await this.chatRepo.findChatById(chat_id);
        }
        return chat_id
    }

    async addMessage(room_id: string, msg: string, profile_id: string): Promise<HelperFunctionResponse> {
        const findRoom = await this.chatRepo.findChatById(room_id);
        if (findRoom) {
            if (findRoom.blocked?.status && findRoom.blocked.blocked_from == profile_id) {
                return {
                    status: false,
                    msg: "Unblock them to send message",
                    statusCode: StatusCode.BAD_REQUEST
                }
            }

            const unseen_message_count: number = findRoom.messages.unseen_message_count
            const updateMessageDetails: IChatMessageDetails = {
                last_message: msg,
                last_message_from: profile_id,
                unseen_message_count: unseen_message_count ? (unseen_message_count + 1) : 1
            }
            const message: IMessageSchema = {
                room_id,
                msg,
                seen: false,
                timeline: new Date(),
                is_block: {
                    status: findRoom.blocked?.status,
                    blocked_from: findRoom.blocked.blocked_from || null
                },
                profile_id: profile_id,
            }
            await this.messagesRepo.insertOne(message);
            await this.chatRepo.addMessageDetails(room_id, updateMessageDetails);
            // await this.chatRepo.
            return {
                status: true,
                msg: "Message added success",
                statusCode: StatusCode.CREATED
            }
        } else {
            return {
                status: false,
                msg: "Room not found",
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }




    async getMyChats(profile_id: string): Promise<HelperFunctionResponse> {
        const findMyChat = await this.chatRepo.findChatMyChat(profile_id);
        if (findMyChat) {
            return {
                statusCode: StatusCode.OK,
                status: true,
                msg: "Chat fetched",
                data: {
                    chats: findMyChat
                }
            }
        } else {
            return {
                statusCode: StatusCode.BAD_REQUEST,
                status: false,
                msg: "No chat found",
            }
        }

    }


    async blockChat(chat_id: string, profile_id: string): Promise<HelperFunctionResponse> {
        const blockChat = await this.chatRepo.blockChat(chat_id, profile_id);
        if (blockChat) {
            return {
                msg: "Chat has been blocked",
                status: true,
                statusCode: StatusCode.OK
            }
        } else {
            return {
                msg: "Chat blocking failed",
                status: false,
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }

    async unBlockChat(chat_id: string, profile_id: string): Promise<HelperFunctionResponse> {
        const blockChat = await this.chatRepo.unBlockChat(chat_id);
        if (blockChat) {
            return {
                msg: "Chat has been unblocked",
                status: true,
                statusCode: StatusCode.OK
            }
        } else {
            return {
                msg: "Chat unblocking failed",
                status: false,
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }

    async startChat(profile_one: string, profile_two: string, msg: string, via: CreateChatVia): Promise<HelperFunctionResponse> {

        if (via == CreateChatVia.DonorId) {
            const findProfileByEmail = await this.userRepo.findProfileByEmailId(profile_two);
            console.log(findProfileByEmail);
            console.log(profile_two);
            console.log("The docs");

            if (findProfileByEmail) {
                profile_two = findProfileByEmail.profile_id.toString();
            } else {
                return {
                    msg: "The profile is not active",
                    status: false,
                    statusCode: StatusCode.NOT_FOUND
                }
            }
        }

        if (profile_one == profile_two) {
            return {
                msg: "Self messaging not allowed!",
                status: false,
                statusCode: StatusCode.BAD_REQUEST
            }
        }

        const checkRoom = await this.chatRepo.isRoomExist(profile_one, profile_two);
        const chat_id: string = checkRoom || await this.createChatId();

        const messageScheme: IMessageSchema = {
            room_id: chat_id,
            is_block: {
                status: false,
                blocked_from: null
            },
            msg: msg,
            profile_id: profile_one,
            seen: false,
            timeline: new Date()
        }

        if (checkRoom) {
            await this.messagesRepo.insertOne(messageScheme)
            return {
                status: true,
                msg: "Message has been sent",
                statusCode: StatusCode.CREATED,
                data: {
                    chat_id
                }
            }
        } else {
            const chat: IChatTemplate = {
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
            }

            const saveChat = await this.chatRepo.createChat(chat)
            if (saveChat) {
                await this.messagesRepo.insertOne(messageScheme)
                return {
                    status: true,
                    msg: "Chat created success",
                    statusCode: StatusCode.CREATED,
                    data: {
                        chat_id: saveChat
                    }
                }
            } else {
                return {
                    status: false,
                    msg: "Chat created failed",
                    statusCode: StatusCode.BAD_REQUEST,
                }
            }
        }
    }


    async getSingleChat(chat_id: string, profile_id: string): Promise<HelperFunctionResponse> {

        const findChat = await this.chatRepo.findSingleChat(chat_id, profile_id);
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
                statusCode: StatusCode.OK
            }
        } else {
            return {
                status: false,
                msg: "No chat found",
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }
}

export default ChatService;