import { Request, Response, NextFunction } from "express";
import TicketService from "../service/ticketService";
import { HelperFunctionResponse } from "../util/types/Interface/UtilInterface";
import { StatusCode, TicketCategory, TicketPriority } from "../util/types/Enum/UtilEnum";
import { ITicketCollection } from "../util/types/Interface/CollectionInterface";
import { CustomRequest } from "../util/types/CustomeType";

class TicketController {
    private ticketService: TicketService;

    constructor() {
        this.ticketService = new TicketService();
    }

    async createTicket(req: CustomRequest, res: Response): Promise<void> {
        const profile_id: string | undefined = req.context?.profile_id;
        const title: string = req.body.title;
        const priority: TicketPriority = req.body.priority;
        const category: TicketCategory = req.body.category;
        const text: string = req.body.text;
        const attachment: string = req.body.attachment;

        if (profile_id) {
            const createResponse: HelperFunctionResponse = await this.ticketService.createTicket(profile_id, title, priority, category, text, attachment);
            res.status(createResponse.statusCode).json({ status: createResponse.status, msg: createResponse.msg, data: createResponse.data });
        } else {
            res.status(StatusCode.BAD_REQUEST).json({ status: false, msg: "Please provide ticket data" });
        }
    }

    async getSingleTicketById(req: Request, res: Response): Promise<void> {
        const ticket_id: string | undefined = req.params.ticket_id;

        if (ticket_id) {
            const getResponse: HelperFunctionResponse = await this.ticketService.getSingleTicketByTicketId(ticket_id);
            res.status(getResponse.statusCode).json({ status: getResponse.status, msg: getResponse.msg, data: getResponse.data });
        } else {
            res.status(StatusCode.BAD_REQUEST).json({ status: false, msg: "Please provide a valid ticket ID" });
        }
    }

    // Update an existing ticket
    async updateTicket(req: Request, res: Response): Promise<void> {
        const ticket_id: string | undefined = req.params.ticket_id;
        const updateData: Partial<ITicketCollection> = req.body;

        if (ticket_id && updateData) {
            const updateResponse: HelperFunctionResponse = await this.ticketService.updateTicket(updateData, ticket_id);
            res.status(updateResponse.statusCode).json({ status: updateResponse.status, msg: updateResponse.msg });
        } else {
            res.status(StatusCode.BAD_REQUEST).json({ status: false, msg: "Please provide a valid ticket ID and update data" });
        }
    }


    async listTickets(req: CustomRequest, res: Response): Promise<void> {
        const page: number = +req.params.page;
        const limit: number = +req.params.limit;
        const profile_id = req.context?.profile_id;

        if (profile_id) {
            const listTickets = await this.ticketService.listTickets(page, limit, profile_id);
            res.status(listTickets.statusCode).json({ status: listTickets.status, msg: listTickets.msg, data: listTickets.data })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized access" })
        }
    }



}

export default TicketController;
