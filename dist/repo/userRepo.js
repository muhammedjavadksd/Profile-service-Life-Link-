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
const UserProfile_1 = __importDefault(require("../database/models/UserProfile"));
class UserRepo {
    constructor() {
        this.profileCollection = UserProfile_1.default;
    }
    insertProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileInstance = new this.profileCollection(profile);
            const saveProfile = yield profileInstance.save();
            return saveProfile === null || saveProfile === void 0 ? void 0 : saveProfile.id;
        });
    }
    findUserByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const singleProfile = yield this.profileCollection.findOne({ user_id });
            return singleProfile;
        });
    }
    findUserByPhoneNumber(phone_number) {
        return __awaiter(this, void 0, void 0, function* () {
            const singleProfile = yield this.profileCollection.findOne({ phone_number });
            return singleProfile;
        });
    }
    findProfileByEmailId(email_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const singleProfile = yield this.profileCollection.findOne({ email: email_id });
            return singleProfile;
        });
    }
    updateProfile(data, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateProfile = yield this.profileCollection.updateOne({ user_id }, { $set: data });
            return updateProfile.modifiedCount > 0;
        });
    }
}
exports.default = UserRepo;
