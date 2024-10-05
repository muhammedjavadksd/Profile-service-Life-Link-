"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const { default: mongoose } = require("mongoose")
const mongoose_1 = __importDefault(require("mongoose"));
function profileDatabseConnection() {
    console.log("Monog URL");
    console.log(process.env.MONGO_URL);
    mongoose_1.default.connect(process.env.MONGO_URL || "").then(() => {
        console.log("Profile database has been connected");
    }).catch((err) => {
        console.log(err);
        console.log("Profile database has been failed");
    });
}
exports.default = profileDatabseConnection;
