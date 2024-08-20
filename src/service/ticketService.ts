import mongoose from "mongoose";
import { IdPrefix, StatusCode, TicketCategory, TicketChatFrom, TicketPriority, TicketStatus } from "../util/types/Enum/UtilEnum";
import { HelperFunctionResponse } from "../util/types/Interface/UtilInterface";
import TicketRepo from "../repo/ticketRepo";
import { ITicketTemplate } from "../util/types/Interface/CollectionInterface";
import UtilHelper from "../helper/utilHelper";

class TicketService {
    ticketRepo;

    constructor() {
        this.ticketRepo = new TicketRepo();
    }

    async createTicket(profile_id: string, title: string, priority: TicketPriority, category: TicketCategory, text: string, attachment: string): Promise<HelperFunctionResponse> {

        const utilHelper = new UtilHelper();
        const randomNumber: number = utilHelper.createOtpNumber(4);
        const randomText: string = utilHelper.createRandomText(4);

        const chatId: string = `${IdPrefix.TicketChatId}-${randomText}-${randomNumber}`;
        const ticketId: string = `${IdPrefix.TicketId}-${randomNumber}-${randomText}`;
        const todayDate: Date = new Date()

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
                attachment,
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

    async getSingleTicketByTicketId(ticket_id: string): Promise<HelperFunctionResponse> {
        const singleTicket = await this.ticketRepo.findTicketById(ticket_id);
        if (singleTicket) {
            return {
                msg: "Ticket found",
                status: true,
                statusCode: StatusCode.OK,
                data: {
                    ticker: singleTicket
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

    async updateTickerProfile(data: Partial<ITickerProfile>, ticker_id: string): Promise<HelperFunctionResponse> {
        const updateTicker = await this.ticketRepo.updateTicketStatus(data, ticker_id);
        if (updateTicker) {
            return {
                msg: "Ticker update success",
                status: true,
                statusCode: StatusCode.OK
            };
        } else {
            return {
                msg: "Ticker update failed",
                status: false,
                statusCode: StatusCode.BAD_REQUEST
            };
        }
    }


    async listTickets(page: number, limit: number, profile_id: string): Promise<HelperFunctionResponse> {
        const skip: number = (page - 1) * limit;
        const findTickets = await this.ticketRepo.findUserPaginedTicket(profile_id, skip, limit);
        const countDocuments = await this.ticketRepo.countUserTicket(profile_id);
        if (findTickets.length) {
            return {
                status: true,
                msg: "Ticket found",
                statusCode: StatusCode.OK,
                data: {
                    tickets: findTickets,
                    total_records: countDocuments,
                    total_pages: countDocuments / limit
                }
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
