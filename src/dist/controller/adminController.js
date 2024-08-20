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
const adminService_1 = __importDefault(require("../src/service/adminService"));
const UtilEnum_1 = require("../src/util/types/Enum/UtilEnum");
class AdminController {
    constructor() {
        this.adminService = new adminService_1.default();
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
