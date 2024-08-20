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

    // Get a ticket by its ID
    async getSingleTicketById(req: Request, res: Response): Promise<void> {
        const ticket_id: string | undefined = req.params.ticket_id;

        if (ticket_id) {
            const getResponse: HelperFunctionResponse = await this.ticketService.getSingleTicketById(ticket_id);
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

    // List all tickets
    async listTickets(req: Request, res: Response): Promise<void> {
        try {
            // Implement the list functionality if needed
            res.status(StatusCode.NOT_IMPLEMENTED).json({ status: false, msg: "List tickets functionality is not implemented yet" });
        } catch (error) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ status: false, msg: "Server error", error });
        }
    }
}

export default TicketController;
