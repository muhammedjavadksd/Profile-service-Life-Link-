"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ticketService_1 = __importDefault(require("../src/service/ticketService"));
class CronJob {
    ticketCron() {
        const ticket = new ticketService_1.default();
        ticket.closeTicket();
        ticket.closeTicketWarning();
    }
}
const cron = new CronJob();
cron.ticketCron();
