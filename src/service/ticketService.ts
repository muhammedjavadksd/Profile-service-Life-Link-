import mongoose from "mongoose";
import { IdPrefix, S3Folder, StatusCode, TicketCategory, TicketChatFrom, TicketPriority, TicketStatus } from "../util/types/Enum/UtilEnum";
import { HelperFunctionResponse } from "../util/types/Interface/UtilInterface";
import TicketRepo from "../repo/ticketRepo";
import { ITicketChat, ITicketTemplate } from "../util/types/Interface/CollectionInterface";
import UtilHelper from "../helper/utilHelper";
import S3BucketHelper from "../helper/S3BucketHelper";

class TicketService {
    ticketRepo;

    constructor() {
        this.ticketRepo = new TicketRepo();
    }



    // async generatePresignedUrl(): Promise<HelperFunctionResponse> {
    //     const s3Bucket = new S3BucketHelper(process.env.TICKET_ATTACHMENT_BUCKET || "");
    //     const utilHelper = new UtilHelper();
    //     const randomNumber: number = utilHelper.createOtpNumber(4)
    //     const randomText: string = utilHelper.createRandomText(4)
    //     const key: string = `ticket-attachment-${randomNumber}-${randomText}`
    //     const presignedUrl = await s3Bucket.generatePresignedUrl(key)
    //     if (presignedUrl) {
    //         return {
    //             msg: "Presigned url created",
    //             status: true,
    //             statusCode: StatusCode.CREATED,
    //             data: {
    //                 url: presignedUrl
    //             }
    //         }
    //     } else {
    //         return {
    //             msg: "Failed to create presigned url",
    //             status: false,
    //             statusCode: StatusCode.BAD_REQUEST,
    //         }
    //     }
    // }

    async createUnqiueTicketId() {
        const utilHelper = new UtilHelper();
        const randomNumber: number = utilHelper.createOtpNumber(4);
        const randomText: string = utilHelper.createRandomText(4);
        let ticketId: string = `${IdPrefix.TicketId}-${randomNumber}-${randomText}`;

        let findTickets = await this.ticketRepo.findTicketById(ticketId);
        let index = 1;
        while (findTickets) {
            ticketId = `${IdPrefix.TicketId}-${randomNumber + index}-${randomText}`;
            index++
            findTickets = await this.ticketRepo.findTicketById(ticketId);
        }
        return ticketId
    }


    async createUniqueChatID(ticket_id: string) {
        const utilHelper = new UtilHelper();
        const randomNumber: number = utilHelper.createOtpNumber(4);
        const randomText: string = utilHelper.createRandomText(4);
        let chatId: string = `${IdPrefix.TicketChatId}-${randomText}-${randomNumber}`;

        let findChats = await this.ticketRepo.findChatFromTicket(ticket_id, chatId);
        let index = 1;
        while (findChats) {
            chatId = `${IdPrefix.TicketChatId}-${randomText}-${randomNumber + index}`;
            index++
            findChats = await this.ticketRepo.findChatFromTicket(ticket_id, chatId);
        }
        return chatId
    }




    async createTicket(profile_id: string, title: string, priority: TicketPriority, category: TicketCategory, text: string, attachment: string): Promise<HelperFunctionResponse> {

        const utilHelper = new UtilHelper();
        const randomNumber: number = utilHelper.createOtpNumber(4);
        const randomText: string = utilHelper.createRandomText(4);

        const ticketId: string = await this.createUnqiueTicketId();
        const chatId: string = `${IdPrefix.TicketChatId}-${randomText}-${randomNumber}`;

        const todayDate: Date = new Date()
        let attachmentDocs = null;

        const s3Helper = new S3BucketHelper(process.env.TICKET_ATTACHMENT_BUCKET || "", S3Folder.TicktAttachment);
        if (attachment) {
            const findName = utilHelper.extractImageNameFromPresignedUrl(attachment);
            if (findName) {
                const checkSecurity = await s3Helper.findFile(findName);
                const attachmentUrl = s3Helper.getViewUrl(findName);
                if (checkSecurity && attachmentUrl) {
                    attachmentDocs = attachmentUrl
                }
            }
        }

        let ticketData: ITicketTemplate = {
            ticket_id: ticketId,
            profile_id,
            updated_at: todayDate,
            category,
            created_at: todayDate,
            status: TicketStatus.Raised,
            title,
            priority,
            chats: [{
                attachment: attachmentDocs,
                chat_id: chatId,
                created_at: todayDate,
                from: TicketChatFrom.User,
                text
            }]
        }

        const insertTicket = await this.ticketRepo.insertTicket(ticketData);
        if (insertTicket) {
            return {
                msg: "Ticker inserted successfully",
                data: {
                    ticker_id: ticketId
                },
                status: true,
                statusCode: StatusCode.CREATED
            };
        } else {
            return {
                msg: "Something went wrong",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            };
        }
    }


    async replayToTicket(from: TicketChatFrom, msg: string, attachment: string, ticket_id: string): Promise<HelperFunctionResponse> {

        const utilHelper = new UtilHelper()
        const newChatId = await this.createUniqueChatID(ticket_id)
        const s3Helper = new S3BucketHelper(process.env.TICKET_ATTACHMENT_BUCKET || "", S3Folder.TicktAttachment);
        let attachmentDocs = null;


        if (attachment) {
            const findName = utilHelper.extractImageNameFromPresignedUrl(attachment);
            if (findName) {
                const find = await s3Helper.findFile(findName)
                console.log(find);
                if (find && findName) {
                    const getViewUrl = s3Helper.getViewUrl(findName);
                    console.log("View url");
                    console.log(getViewUrl);
                    if (getViewUrl) {
                        attachmentDocs = getViewUrl
                    }
                }
            }
        }
        let newChat: ITicketChat = {
            attachment: attachmentDocs,
            chat_id: newChatId,
            created_at: new Date(),
            from,
            text: msg
        }
        const addReplay = await this.ticketRepo.addChatToTicket(ticket_id, newChat);
        if (addReplay) {
            return {
                msg: "Chat added to tickets",
                status: true,
                statusCode: StatusCode.CREATED,
                data: {
                    attachment: attachmentDocs
                }
            }
        } else {
            return {
                msg: "Chat adding failed",
                status: false,
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }

    async getSingleTicketByTicketId(ticket_id: string, from_admin: boolean, profile_id?: string): Promise<HelperFunctionResponse> {
        const singleTicket = await this.ticketRepo.findTicketById(ticket_id);
        if (singleTicket) {
            if (!from_admin) {
                if (singleTicket.profile_id != profile_id) {
                    return {
                        msg: "Ticket not found",
                        status: false,
                        statusCode: StatusCode.NOT_FOUND
                    };
                }
            }
            return {
                msg: "Ticket found",
                status: true,
                statusCode: StatusCode.OK,
                data: {
                    ticket: singleTicket
                }
            };
        } else {
            return {
                msg: "Ticket not found",
                status: false,
                statusCode: StatusCode.NOT_FOUND
            };
        }
    }

    // async updateTickerProfile(data: Partial<ITickerProfile>, ticker_id: string): Promise<HelperFunctionResponse> {
    //     const updateTicker = await this.ticketRepo.updateTicketStatus(data, ticker_id);
    //     if (updateTicker) {
    //         return {
    //             msg: "Ticker update success",
    //             status: true,
    //             statusCode: StatusCode.OK
    //         };
    //     } else {
    //         return {
    //             msg: "Ticker update failed",
    //             status: false,
    //             statusCode: StatusCode.BAD_REQUEST
    //         };
    //     }
    // }


    async listAdminTickets(page: number, limit: number, status: TicketStatus): Promise<HelperFunctionResponse> {
        const skip: number = (page - 1) * limit;
        const findTickets = await this.ticketRepo.findPaginedTicket(skip, limit, status);
        if (findTickets.paginated.length) {
            return {
                status: true,
                msg: "Ticket found",
                statusCode: StatusCode.OK,
                data: findTickets
            }
        } else {
            return {
                status: false,
                msg: "No ticket found",
                statusCode: StatusCode.NOT_FOUND,
            }
        }
    }

    async listTickets(page: number, limit: number, profile_id: string): Promise<HelperFunctionResponse> {
        const skip: number = (page - 1) * limit;
        const findTickets = await this.ticketRepo.findUserPaginedTicket(profile_id, skip, limit);
        // const countDocuments = await this.ticketRepo.countUserTicket(profile_id);
        if (findTickets.total_records) {
            return {
                status: true,
                msg: "Ticket found",
                statusCode: StatusCode.OK,
                data: findTickets
            }
        } else {
            return {
                status: false,
                msg: "No ticket found",
                statusCode: StatusCode.NOT_FOUND,
            }
        }
    }
}

export default TicketService;
