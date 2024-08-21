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
const UtilEnum_1 = require("../util/types/Enum/UtilEnum");
const ticketRepo_1 = __importDefault(require("../repo/ticketRepo"));
const utilHelper_1 = __importDefault(require("../helper/utilHelper"));
const S3BucketHelper_1 = __importDefault(require("../helper/S3BucketHelper"));
class TicketService {
    constructor() {
        this.ticketRepo = new ticketRepo_1.default();
    }
    generatePresignedUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const s3Bucket = new S3BucketHelper_1.default(process.env.TICKET_ATTACHMENT_BUCKET || "");
            const utilHelper = new utilHelper_1.default();
            const randomNumber = utilHelper.createOtpNumber(4);
            const randomText = utilHelper.createRandomText(4);
            const key = `ticket-attachment-${randomNumber}-${randomText}`;
            const presignedUrl = yield s3Bucket.generatePresignedUrl(key);
            if (presignedUrl) {
                return {
                    msg: "Presigned url created",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.CREATED,
                    data: {
                        url: presignedUrl
                    }
                };
            }
            else {
                return {
                    msg: "Failed to create presigned url",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUEST,
                };
            }
        });
    }
    createUnqiueTicketId() {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new utilHelper_1.default();
            const randomNumber = utilHelper.createOtpNumber(4);
            const randomText = utilHelper.createRandomText(4);
            let ticketId = `${UtilEnum_1.IdPrefix.TicketId}-${randomNumber}-${randomText}`;
            let findTickets = yield this.ticketRepo.findTicketById(ticketId);
            let index = 1;
            while (findTickets) {
                ticketId = `${UtilEnum_1.IdPrefix.TicketId}-${randomNumber + index}-${randomText}`;
                index++;
                findTickets = yield this.ticketRepo.findTicketById(ticketId);
            }
            return ticketId;
        });
    }
    createUniqueChatID(ticket_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new utilHelper_1.default();
            const randomNumber = utilHelper.createOtpNumber(4);
            const randomText = utilHelper.createRandomText(4);
            let chatId = `${UtilEnum_1.IdPrefix.TicketChatId}-${randomText}-${randomNumber}`;
            let findChats = yield this.ticketRepo.findChatFromTicket(ticket_id, chatId);
            let index = 1;
            while (findChats) {
                chatId = `${UtilEnum_1.IdPrefix.TicketChatId}-${randomText}-${randomNumber + index}`;
                index++;
                findChats = yield this.ticketRepo.findChatFromTicket(ticket_id, chatId);
            }
            return chatId;
        });
    }
    createTicket(profile_id, title, priority, category, text, attachment) {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new utilHelper_1.default();
            const randomNumber = utilHelper.createOtpNumber(4);
            const randomText = utilHelper.createRandomText(4);
            const ticketId = yield this.createUnqiueTicketId();
            const chatId = `${UtilEnum_1.IdPrefix.TicketChatId}-${randomText}-${randomNumber}`;
            const todayDate = new Date();
            const s3Helper = new S3BucketHelper_1.default(process.env.TICKET_ATTACHMENT_BUCKET || "");
            if (attachment) {
                attachment = s3Helper.getImageNameFromUrl(attachment);
            }
            let ticketData = {
                ticket_id: ticketId,
                profile_id,
                updated_at: todayDate,
                category,
                created_at: todayDate,
                status: UtilEnum_1.TicketStatus.Raised,
                title,
                priority,
                chats: [{
                        attachment,
                        chat_id: chatId,
                        created_at: todayDate,
                        from: UtilEnum_1.TicketChatFrom.User,
                        text
                    }]
            };
            const insertTicket = yield this.ticketRepo.insertTicket(ticketData);
            if (insertTicket) {
                return {
                    msg: "Ticker inserted successfully",
                    data: {
                        ticker_id: ticketId
                    },
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.CREATED
                };
            }
            else {
                return {
                    msg: "Something went wrong",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                };
            }
        });
    }
    replayToTicket(from, msg, attachment, ticket_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newChatId = yield this.createUniqueChatID(ticket_id);
            let newChat = {
                attachment: attachment,
                chat_id: newChatId,
                created_at: new Date(),
                from,
                text: msg
            };
            const addReplay = yield this.ticketRepo.addChatToTicket(ticket_id, newChat);
            if (addReplay) {
                return {
                    msg: "Chat added to tickets",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.CREATED
                };
            }
            else {
                return {
                    msg: "Chat adding failed",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUEST
                };
            }
        });
    }
    getSingleTicketByTicketId(ticket_id, from_admin, profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const singleTicket = yield this.ticketRepo.findTicketById(ticket_id);
            if (singleTicket) {
                if (!from_admin) {
                    if (singleTicket.profile_id != profile_id) {
                        return {
                            msg: "Ticket not found",
                            status: false,
                            statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                        };
                    }
                }
                return {
                    msg: "Ticket found",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK,
                    data: {
                        ticker: singleTicket
                    }
                };
            }
            else {
                return {
                    msg: "Ticket not found",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                };
            }
        });
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
    listAdminTickets(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const findTickets = yield this.ticketRepo.findPaginedTicket(skip, limit);
            const countDocuments = yield this.ticketRepo.countTickets();
            if (findTickets.length) {
                return {
                    status: true,
                    msg: "Ticket found",
                    statusCode: UtilEnum_1.StatusCode.OK,
                    data: {
                        tickets: findTickets,
                        total_records: countDocuments,
                        total_pages: countDocuments / limit
                    }
                };
            }
            else {
                return {
                    status: false,
                    msg: "No ticket found",
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND,
                };
            }
        });
    }
    listTickets(page, limit, profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const findTickets = yield this.ticketRepo.findUserPaginedTicket(profile_id, skip, limit);
            const countDocuments = yield this.ticketRepo.countUserTicket(profile_id);
            if (findTickets.length) {
                return {
                    status: true,
                    msg: "Ticket found",
                    statusCode: UtilEnum_1.StatusCode.OK,
                    data: {
                        tickets: findTickets,
                        total_records: countDocuments,
                        total_pages: countDocuments / limit
                    }
                };
            }
            else {
                return {
                    status: false,
                    msg: "No ticket found",
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND,
                };
            }
        });
    }
}
exports.default = TicketService;
