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
const Tickets_1 = __importDefault(require("../database/models/Tickets"));
const UtilEnum_1 = require("../util/types/Enum/UtilEnum");
class TicketRepo {
    constructor() {
        this.ticketCollection = Tickets_1.default;
    }
    insertTicket(ticket) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(ticket);
            const ticketInstance = new this.ticketCollection(ticket);
            const savedTicket = yield ticketInstance.save();
            return (savedTicket === null || savedTicket === void 0 ? void 0 : savedTicket.id) || null;
        });
    }
    findInActive(days, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const startOfTargetDay = new Date(today.setDate(today.getDate() - days));
            startOfTargetDay.setHours(0, 0, 0, 0);
            const endOfTargetDay = new Date(startOfTargetDay);
            endOfTargetDay.setHours(23, 59, 59, 999); // End of the day (23:59:59)
            try {
                const find = yield this.ticketCollection.aggregate([
                    {
                        $match: {
                            updated_at: {
                                $gte: startOfTargetDay,
                                $lte: endOfTargetDay
                            },
                            status: { $ne: UtilEnum_1.TicketStatus.Closed }
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
                ]);
                return find;
            }
            catch (e) {
                console.log(e);
                return [];
            }
        });
    }
    findPriority(date) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield this.ticketCollection.find({ priority: UtilEnum_1.TicketPriority.High, created_at: { $gte: date } });
            return find.length <= 1;
        });
    }
    findHighPriorityOnThisMonth(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const startOfMonth = new Date();
            startOfMonth.setMonth(startOfMonth.getMonth() - 1);
            this.ticketCollection.find({ priority: UtilEnum_1.TicketPriority.High, created_at: { $gt: startOfMonth } });
        });
    }
    findChatFromTicket(ticket_id, chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findChat = yield this.ticketCollection.findOne({ "chats.chat_id": chat_id, ticket_id });
            return findChat;
        });
    }
    findTicketById(ticket_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const singleTicket = yield this.ticketCollection.aggregate([
                {
                    $match: {
                        ticket_id
                    }
                },
            ]);
            return singleTicket[0];
        });
    }
    findTicketsByProfileId(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tickets = yield this.ticketCollection.find({ profile_id });
            return tickets;
        });
    }
    countUserTicket(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const coundUserTickets = yield this.ticketCollection.find({ profile_id }).countDocuments();
            return coundUserTickets;
        });
    }
    countTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            const coundTickets = yield this.ticketCollection.find({}).countDocuments();
            return coundTickets;
        });
    }
    findUserPaginedTicket(profile_id, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield this.ticketCollection.aggregate([
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
                ]);
                const response = {
                    paginated: tickets[0].paginated,
                    total_records: tickets[0].total_records
                };
                return response;
            }
            catch (e) {
                const response = {
                    paginated: [],
                    total_records: 0
                };
                return response;
            }
        });
    }
    findPaginedTicket(skip, limit, status, category, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const matchFilter = status ? { 'status': status } : {};
                if (search) {
                    matchFilter['ticket_id'] = {
                        $regex: search,
                        $options: "i"
                    };
                }
                if (category) {
                    matchFilter['category'] = category;
                }
                console.log(search);
                console.log(category);
                console.log("Macth filter");
                console.log(matchFilter);
                const tickets = yield this.ticketCollection.aggregate([
                    {
                        $match: matchFilter
                    },
                    {
                        $facet: {
                            paginated: [
                                {
                                    $addFields: {
                                        statusPriority: {
                                            $switch: {
                                                branches: [
                                                    { case: { $eq: ["$priority", UtilEnum_1.TicketPriority.High] }, then: 1 },
                                                    { case: { $eq: ["$priority", UtilEnum_1.TicketPriority.Critical] }, then: 2 },
                                                    { case: { $eq: ["$priority", UtilEnum_1.TicketPriority.Medium] }, then: 3 },
                                                    { case: { $eq: ["$priority", UtilEnum_1.TicketPriority.Low] }, then: 4 }
                                                ],
                                                default: 5
                                            }
                                        }
                                    }
                                },
                                {
                                    $sort: {
                                        statusPriority: 1,
                                        updated_at: -1
                                    }
                                },
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
                ]);
                console.log("All tickets");
                console.log(tickets);
                const response = {
                    paginated: tickets[0].paginated,
                    total_records: tickets[0].total_records
                };
                return response;
            }
            catch (e) {
                console.log(e);
                const response = {
                    paginated: [],
                    total_records: 0
                };
                return response;
            }
        });
    }
    updateTicketStatus(ticket_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateTicket = yield this.ticketCollection.updateOne({ ticket_id }, { $set: { status, updated_at: new Date() } });
            return updateTicket.modifiedCount > 0;
        });
    }
    bulkUpdateTicketStatus(ticket_ids, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateTicket = yield this.ticketCollection.updateOne({ ticket_id: { $in: ticket_ids } }, { $set: { status, updated_at: new Date() } });
            return updateTicket.modifiedCount > 0;
        });
    }
    updateTicketPriority(ticket_id, priority, priority_number) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateTicket = yield this.ticketCollection.updateOne({ ticket_id }, { $set: { priority, priority_number, updated_at: new Date() } });
            return updateTicket.modifiedCount > 0;
        });
    }
    addChatToTicket(ticket_id, chat) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateTicket = yield this.ticketCollection.updateOne({ ticket_id }, {
                $push: { chats: chat },
                $set: {
                    updated_at: new Date(),
                    status: UtilEnum_1.TicketStatus.Answered
                }
            });
            return updateTicket.modifiedCount > 0;
        });
    }
}
exports.default = TicketRepo;
