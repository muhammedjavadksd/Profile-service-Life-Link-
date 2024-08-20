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
        const ticketInstance = new this.ticketCollection(ticket);
        const savedTicket = await ticketInstance.save();
        return savedTicket?.id || null;
    }

    async findTicketById(ticket_id: string): Promise<ITicketCollection | null> {
        const singleTicket = await this.ticketCollection.findOne({ ticket_id });
        return singleTicket;
    }

    async findTicketsByProfileId(profile_id: string): Promise<ITicketCollection[] | []> {
        const tickets = await this.ticketCollection.find({ profile_id });
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
