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
const Messages_1 = __importDefault(require("../database/models/Messages"));
class MessagesRepo {
    insertOne(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new Messages_1.default(data);
            const save = yield instance.save();
            return save === null || save === void 0 ? void 0 : save.id;
        });
    }
    updateSeen(room_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findLastData = yield Messages_1.default.findOne({ room_id }).sort({ timeline: -1 });
            console.log("Last data");
            console.log(findLastData);
            if (findLastData) {
                console.log(yield Messages_1.default.findOne({ _id: findLastData === null || findLastData === void 0 ? void 0 : findLastData._id }));
                const updateSeen = yield Messages_1.default.updateOne({ _id: findLastData === null || findLastData === void 0 ? void 0 : findLastData._id }, { $set: { seen: true } });
                console.log(updateSeen);
                return updateSeen.modifiedCount > 0;
            }
            else {
                return false;
            }
        });
    }
}
exports.default = MessagesRepo;
