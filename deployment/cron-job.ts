import TicketService from "../src/service/ticketService";


class CronJob {

    ticketCron() {
        const ticket = new TicketService();

        ticket.closeTicket()
        ticket.closeTicketWarning()
    }
}


const cron = new CronJob();
cron.ticketCron();