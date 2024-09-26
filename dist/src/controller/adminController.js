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
const adminService_1 = __importDefault(require("../service/adminService"));
const UtilEnum_1 = require("../util/types/Enum/UtilEnum");
const ticketService_1 = __importDefault(require("../service/ticketService"));
const imageService_1 = __importDefault(require("../service/imageService"));
class AdminController {
    constructor() {
        this.adminService = new adminService_1.default();
        this.ticketServcie = new ticketService_1.default();
        this.imageService = new imageService_1.default();
        this.getSingleTicket = this.getSingleTicket.bind(this);
        this.getTickets = this.getTickets.bind(this);
        this.addReplayToChat = this.addReplayToChat.bind(this);
        this.createPresignedUrl = this.createPresignedUrl.bind(this);
        this.getSingleUserByProfileId = this.getSingleUserByProfileId.bind(this);
    }
    addReplayToChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket_id = req.params.ticket_id;
            const msg = req.body.msg;
            const attachment = req.body.attachment;
            const addReplay = yield this.ticketServcie.replayToTicket(UtilEnum_1.TicketChatFrom.Admin, msg, attachment, ticket_id);
            res.status(addReplay.statusCode).json({ status: addReplay.status, msg: addReplay.msg, data: addReplay.data });
        });
    }
    getSingleTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket_id = req.params.ticket_id;
            console.log("Single ticket");
            const findSingleTicket = yield this.ticketServcie.getSingleTicketByTicketId(ticket_id, true);
            res.status(findSingleTicket.statusCode).json({ status: findSingleTicket.status, msg: findSingleTicket.msg, data: findSingleTicket.data });
        });
    }
    createPresignedUrl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = req.query.file;
            console.log("This workded");
            if (fileName) {
                const signedUrl = yield this.imageService.createPresignedUrl(fileName.toString(), process.env.TICKET_ATTACHMENT_BUCKET || "", UtilEnum_1.S3Folder.TicktAttachment);
                res.status(signedUrl.statusCode).json({ status: signedUrl.status, msg: signedUrl.msg, data: signedUrl.data });
            }
            else {
                res.status(UtilEnum_1.StatusCode.BAD_REQUEST).json({ status: false, msg: "Something went wrong" });
            }
        });
    }
    getTickets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const limit = +req.params.limit;
            const page = +req.params.page;
            const status = req.params.status;
            const category = req.query.category;
            const query = (_a = req.query.query) === null || _a === void 0 ? void 0 : _a.toString();
            const findTicket = yield this.ticketServcie.listAdminTickets(page, limit, status, category, query);
            console.log(findTicket);
            res.status(findTicket.statusCode).json({ status: findTicket.status, msg: findTicket.msg, data: findTicket.data });
        });
    }
    getSingleUserByProfileId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile_id = req.params.profile_id;
            if (profile_id) {
                const findProfile = yield this.adminService.getSingleProfileByProfileId(profile_id); //profileHelper.getSingleProfileByProfileId(profile_id);
                res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data });
            }
            else {
                res.status(400).json({ status: false, msg: "Please provide a valid profile ID" });
            }
        });
    }
    getUserByIdsController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_ids = req.body.user_ids;
            if (user_ids) {
                const findProfiles = yield this.adminService.getProfileByIds(user_ids);
                res.status(findProfiles.statusCode).json({ status: findProfiles.status, msg: findProfiles.msg, data: findProfiles.data });
            }
            else {
                res.status(UtilEnum_1.StatusCode.BAD_REQUEST).json({ status: false, msg: "Provide valid user IDs" });
            }
        });
    }
}
exports.default = AdminController;
