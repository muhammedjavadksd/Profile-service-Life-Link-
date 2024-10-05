import mongoose from "mongoose";
import TicketService from "../src/service/ticketService";
import profileDatabseConnection from "../src/database/connection";


class CronJob {

    constructor() {
        if (!mongoose.connection.readyState) {
            profileDatabseConnection();
        }
    }

    ticketCron() {
        const ticket = new TicketService();

        ticket.closeTicket()
        ticket.closeTicketWarning()
    }
}


const cron = new CronJob();
cron.ticketCron();