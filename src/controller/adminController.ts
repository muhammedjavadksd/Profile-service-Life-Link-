import { Request, Response, NextFunction } from "express";
import AdminService from "../service/adminService";
import { HelperFunctionResponse } from "../util/types/Interface/UtilInterface";
import { StatusCode, TicketChatFrom } from "../util/types/Enum/UtilEnum";
import TicketService from "../service/ticketService";

class AdminController {


    adminService;
    ticketServcie;
    constructor() {
        this.adminService = new AdminService();
        this.ticketServcie = new TicketService();
    }


    async addReplayToChat(req: Request, res: Response): Promise<void> {
        const ticket_id: string = req.params.ticket_id;
        const msg: string = req.body.msg;
        const attachment: string = req.body.attachment;

        const addReplay: HelperFunctionResponse = await this.ticketServcie.replayToTicket(TicketChatFrom.Admin, msg, attachment, ticket_id);
        res.status(addReplay.statusCode).json({ status: addReplay.status, msg: addReplay.msg, data: addReplay.data });
    }

    async getSingleTicket(req: Request, res: Response): Promise<void> {
        const ticket_id: string = req.params.ticket_id

        const findSingleTicket = await this.ticketServcie.getSingleTicketByTicketId(ticket_id, true);
        res.status(findSingleTicket.statusCode).json({ status: findSingleTicket.status, msg: findSingleTicket.msg, data: findSingleTicket.data })
    }

    async getTickets(req: Request, res: Response): Promise<void> {
        const limit: number = +req.params.limit;
        const page: number = +req.params.page;

        const findTicket: HelperFunctionResponse = await this.ticketServcie.listAdminTickets(page, limit);
        res.status(findTicket.statusCode).json({ status: findTicket.status, msg: findTicket.msg, data: findTicket.data })
    }

    async getSingleUserByProfileId(req: Request, res: Response): Promise<void> {
        const profile_id: string | undefined = req.params.profile_id;

        if (profile_id) {
            const findProfile = await this.adminService.getSingleProfileByProfileId(profile_id) //profileHelper.getSingleProfileByProfileId(profile_id);
            res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data });
        } else {
            res.status(400).json({ status: false, msg: "Please provide a valid profile ID" });
        }
    }

    async getUserByIdsController(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user_ids: string | undefined = req.body.user_ids;

        if (user_ids) {
            const findProfiles: HelperFunctionResponse = await this.adminService.getProfileByIds(user_ids);
            res.status(findProfiles.statusCode).json({ status: findProfiles.status, msg: findProfiles.msg, data: findProfiles.data });
        } else {
            res.status(StatusCode.BAD_REQUEST).json({ status: false, msg: "Provide valid user IDs" });
        }
    }
}

export default AdminController;
