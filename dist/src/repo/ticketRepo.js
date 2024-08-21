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
            const singleTicket = yield this.ticketCollection.findOne({ ticket_id });
            return singleTicket;
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
            const tickets = yield this.ticketCollection.find({ profile_id }).skip(skip).limit(limit);
            return tickets;
        });
    }
    findPaginedTicket(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const tickets = yield this.ticketCollection.find({}).skip(skip).limit(limit);
            return tickets;
        });
    }
    updateTicketStatus(ticket_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateTicket = yield this.ticketCollection.updateOne({ ticket_id }, { $set: { status, updated_at: new Date() } });
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
            const updateTicket = yield this.ticketCollection.updateOne({ ticket_id }, { $push: { chats: chat }, $set: { updated_at: new Date() } });
            return updateTicket.modifiedCount > 0;
        });
    }
}
exports.default = TicketRepo;
