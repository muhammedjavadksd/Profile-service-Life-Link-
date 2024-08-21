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
const ticketService_1 = __importDefault(require("../service/ticketService"));
const UtilEnum_1 = require("../util/types/Enum/UtilEnum");
class TicketController {
    constructor() {
        this.ticketAttachementUrl = this.ticketAttachementUrl.bind(this);
        this.createTicket = this.createTicket.bind(this);
        this.getSingleTicketById = this.getSingleTicketById.bind(this);
        this.replayToTicket = this.replayToTicket.bind(this);
        this.listTickets = this.listTickets.bind(this);
        this.ticketService = new ticketService_1.default();
    }
    ticketAttachementUrl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createUrl = yield this.ticketService.generatePresignedUrl();
            res.status(createUrl.statusCode).json({ status: createUrl.status, msg: createUrl.msg, data: createUrl.data });
        });
    }
    createTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const profile_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.profile_id;
            const title = req.body.title;
            const priority = req.body.priority;
            const category = req.body.category;
            const text = req.body.text;
            const attachment = req.body.attachment;
            if (profile_id) {
                const createResponse = yield this.ticketService.createTicket(profile_id, title, priority, category, text, attachment);
                res.status(createResponse.statusCode).json({ status: createResponse.status, msg: createResponse.msg, data: createResponse.data });
            }
            else {
                res.status(UtilEnum_1.StatusCode.BAD_REQUEST).json({ status: false, msg: "Please provide ticket data" });
            }
        });
    }
    getSingleTicketById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const ticket_id = req.params.ticket_id;
            const profile_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.profile_id;
            if (ticket_id && profile_id) {
                const getResponse = yield this.ticketService.getSingleTicketByTicketId(ticket_id, false, profile_id);
                res.status(getResponse.statusCode).json({ status: getResponse.status, msg: getResponse.msg, data: getResponse.data });
            }
            else {
                res.status(UtilEnum_1.StatusCode.BAD_REQUEST).json({ status: false, msg: "Please provide a valid ticket ID" });
            }
        });
    }
    // Update an existing ticket
    replayToTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket_id = req.params.ticket_id;
            const text = req.body.text;
            const attachment = req.body.attachment;
            if (ticket_id) {
                const updateResponse = yield this.ticketService.replayToTicket(UtilEnum_1.TicketChatFrom.User, text, attachment, ticket_id);
                res.status(updateResponse.statusCode).json({ status: updateResponse.status, msg: updateResponse.msg });
            }
            else {
                res.status(UtilEnum_1.StatusCode.BAD_REQUEST).json({ status: false, msg: "Please provide a valid ticket ID and update data" });
            }
        });
    }
    listTickets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const page = +req.params.page;
            const limit = +req.params.limit;
            const profile_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.profile_id;
            if (profile_id) {
                const listTickets = yield this.ticketService.listTickets(page, limit, profile_id);
                res.status(listTickets.statusCode).json({ status: listTickets.status, msg: listTickets.msg, data: listTickets.data });
            }
            else {
                res.status(UtilEnum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized access" });
            }
        });
    }
}
exports.default = TicketController;
