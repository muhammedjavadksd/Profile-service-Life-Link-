import { ObjectId } from "mongoose";
import TicketModel from "../database/models/Tickets";
import { ITicketChat, ITicketCollection, ITicketTemplate } from "../util/types/Interface/CollectionInterface";
import { TicketPriority, TicketStatus } from "../util/types/Enum/UtilEnum";

class TicketRepo {
    private ticketCollection;

    constructor() {
        this.ticketCollection = TicketModel;
    }

    async insertTicket(ticket: ITicketTemplate): Promise<ObjectId | null> {
        console.log(ticket);

        const ticketInstance = new this.ticketCollection(ticket);
        const savedTicket = await ticketInstance.save();
        return savedTicket?.id || null;
    }


    async findHighPriorityOnThisMonth(profile_id: string) {
        const now = new Date();
        const startOfMonth = new Date();
        startOfMonth.setMonth(startOfMonth.getMonth() - 1)

        this.ticketCollection.find({ priority: TicketPriority.High, created_at: { $gt: startOfMonth } })
    }


    async findChatFromTicket(ticket_id: string, chat_id: string): Promise<ITicketCollection | null> {
        const findChat = await this.ticketCollection.findOne({ "chats.chat_id": chat_id, ticket_id })
        return findChat;
    }

    async findTicketById(ticket_id: string): Promise<ITicketCollection | null> {
        const singleTicket = await this.ticketCollection.findOne({ ticket_id });
        return singleTicket;
    }

    async findTicketsByProfileId(profile_id: string): Promise<ITicketCollection[] | []> {
        const tickets = await this.ticketCollection.find({ profile_id });
        return tickets;
    }

    async countUserTicket(profile_id: string): Promise<number> {
        const coundUserTickets: number = await this.ticketCollection.find({ profile_id }).countDocuments();
        return coundUserTickets
    }

    async countTickets(): Promise<number> {
        const coundTickets: number = await this.ticketCollection.find({}).countDocuments();
        return coundTickets
    }

    async findUserPaginedTicket(profile_id: string, skip: number, limit: number): Promise<ITicketCollection[] | []> {
        const tickets = await this.ticketCollection.find({ profile_id }).skip(skip).limit(limit);
        return tickets;
    }

    async findPaginedTicket(skip: number, limit: number): Promise<ITicketCollection[] | []> {
        const tickets = await this.ticketCollection.find({}).skip(skip).limit(limit);
        return tickets;
    }

    async updateTicketStatus(ticket_id: string, status: TicketStatus): Promise<boolean> {
        const updateTicket = await this.ticketCollection.updateOne({ ticket_id }, { $set: { status, updated_at: new Date() } });
        return updateTicket.modifiedCount > 0;
    }

    async updateTicketPriority(ticket_id: string, priority: TicketPriority, priority_number: number): Promise<boolean> {
        const updateTicket = await this.ticketCollection.updateOne(
            { ticket_id },
            { $set: { priority, priority_number, updated_at: new Date() } }
        );
        return updateTicket.modifiedCount > 0;
    }

    async addChatToTicket(ticket_id: string, chat: ITicketChat): Promise<boolean> {
        const updateTicket = await this.ticketCollection.updateOne(
            { ticket_id },
            { $push: { chats: chat }, $set: { updated_at: new Date() } }
        );
        return updateTicket.modifiedCount > 0;
    }
}

export default TicketRepo;
