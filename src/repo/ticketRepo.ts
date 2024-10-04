import { ObjectId } from "mongoose";
import TicketModel from "../database/models/Tickets";
import { IPopulatedTicketTemplate, ITicketChat, ITicketCollection, ITicketTemplate } from "../util/types/Interface/CollectionInterface";
import { TicketCategory, TicketPriority, TicketStatus } from "../util/types/Enum/UtilEnum";
import { IPaginatedResponse } from "../util/types/Interface/UtilInterface";

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

    async findInActive(days: number, skip: number, limit: number): Promise<IPopulatedTicketTemplate[]> {
        const today = new Date();
        today.setDate(today.getDate() - days)

        try {
            const find = await this.ticketCollection.aggregate([
                {
                    $match: {
                        updated_at: { $lt: today },
                        status: { $ne: TicketStatus.Closed }
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                },
                {
                    $lookup: {
                        from: "user_profile",
                        localField: "profile_id",
                        foreignField: "profile_id",
                        as: "profile"
                    }
                },
                {
                    $unwind: "$profile"
                }
            ])

            return find;
        } catch (e) {
            return [];
        }
    }

    async findPriority(date: Date): Promise<boolean> {
        const find = await this.ticketCollection.find({ priority: TicketPriority.High, created_at: { $gte: date } });
        return find.length <= 1
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
        const singleTicket = await this.ticketCollection.aggregate(
            [
                {
                    $match: {
                        ticket_id
                    }
                },
            ]);
        return singleTicket[0];
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

    async findUserPaginedTicket(profile_id: string, skip: number, limit: number): Promise<IPaginatedResponse<ITicketCollection[]>> {

        try {
            const tickets = await this.ticketCollection.aggregate([
                {
                    $match: { profile_id }
                },
                {
                    $facet: {
                        paginated: [
                            {
                                $skip: skip
                            },
                            {
                                $limit: limit
                            }
                        ],
                        total_records: [
                            {
                                $count: "total_records"
                            }
                        ]
                    }
                },
                {
                    $unwind: "$total_records"
                },
                {
                    $project: {
                        paginated: 1,
                        total_records: "$total_records.total_records"
                    }
                }
            ])


            const response: IPaginatedResponse<ITicketCollection[]> = {
                paginated: tickets[0].paginated,
                total_records: tickets[0].total_records
            }

            return response;
        } catch (e) {
            const response: IPaginatedResponse<ITicketCollection[]> = {
                paginated: [],
                total_records: 0
            }
            return response;
        }
    }

    async findPaginedTicket(skip: number, limit: number, status?: TicketStatus, category?: TicketCategory, search?: string): Promise<IPaginatedResponse<ITicketCollection[]>> {
        try {

            const matchFilter: Record<string, any> = status ? { 'status': status } : {}



            if (search) {
                matchFilter['ticket_id'] = {
                    $regex: search,
                    $options: "i"
                }
            }

            if (category) {
                matchFilter['category'] = category
            }

            console.log(search);
            console.log(category);

            console.log("Macth filter");


            console.log(matchFilter);


            const tickets = await this.ticketCollection.aggregate([
                {
                    $match: matchFilter
                },
                {
                    $facet: {
                        paginated: [
                            {
                                $skip: skip
                            },
                            {
                                $limit: limit
                            }
                        ],
                        total_records: [
                            {
                                $count: "total_records"
                            }
                        ]
                    }
                },
                {
                    $unwind: "$total_records"
                },
                {
                    $project: {
                        paginated: 1,
                        total_records: "$total_records.total_records"
                    }
                }
            ])


            console.log("All tickets");
            console.log(tickets);



            const response: IPaginatedResponse<ITicketCollection[]> = {
                paginated: tickets[0].paginated,
                total_records: tickets[0].total_records
            }

            return response;
        } catch (e) {
            console.log(e);

            const response: IPaginatedResponse<ITicketCollection[]> = {
                paginated: [],
                total_records: 0
            }
            return response;
        }
    }

    async updateTicketStatus(ticket_id: string, status: TicketStatus): Promise<boolean> {
        const updateTicket = await this.ticketCollection.updateOne({ ticket_id }, { $set: { status, updated_at: new Date() } });
        return updateTicket.modifiedCount > 0;
    }

    async bulkUpdateTicketStatus(ticket_ids: string[], status: TicketStatus): Promise<boolean> {
        const updateTicket = await this.ticketCollection.updateOne({ ticket_id: { $in: ticket_ids } }, { $set: { status, updated_at: new Date() } });
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
            {
                $push: { chats: chat },
                $set: {
                    updated_at: new Date(),
                    status: TicketStatus.Answered
                }
            }
        );
        return updateTicket.modifiedCount > 0;
    }
}

export default TicketRepo;
