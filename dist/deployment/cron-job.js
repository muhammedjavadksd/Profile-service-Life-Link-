"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ticketService_1 = __importDefault(require("../src/service/ticketService"));
const connection_1 = __importDefault(require("../src/database/connection"));
class CronJob {
    constructor() {
        if (!mongoose_1.default.connection.readyState) {
            (0, connection_1.default)();
        }
    }
    ticketCron() {
        const ticket = new ticketService_1.default();
        ticket.closeTicket();
        ticket.closeTicketWarning();
    }
}
const cron = new CronJob();
cron.ticketCron();
