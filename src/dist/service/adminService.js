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
const mongoose_1 = __importDefault(require("mongoose"));
const userRepo_1 = __importDefault(require("../repo/userRepo"));
const UtilEnum_1 = require("../src/util/types/Enum/UtilEnum");
class AdminService {
    constructor() {
        this.userRepo = new userRepo_1.default();
    }
    getProfileByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileIds = JSON.parse(ids);
            const objectIds = profileIds.map(id => new mongoose_1.default.Types.ObjectId(id));
            const allUsers = yield this.userRepo.findUserProfileByIds(objectIds);
            if (allUsers.length) {
                return {
                    msg: "User profile found",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK,
                    data: {
                        profiles: allUsers
                    }
                };
            }
            else {
                return {
                    msg: "No profile found",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND,
                };
            }
        });
    }
    getSingleProfileByProfileId(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const singleProfile = yield this.userRepo.findUserByUserId(profile_id); //UserProfileModel.findOne({ profile_id });
            if (singleProfile) {
                return {
                    msg: "Profile found",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK,
                    data: {
                        profile: singleProfile
                    }
                };
            }
            else {
                return {
                    msg: "No profile found",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND,
                };
            }
        });
    }
}
exports.default = AdminService;
