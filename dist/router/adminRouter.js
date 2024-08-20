"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require("express");
const express_1 = __importDefault(require("express"));
const authMiddleware = require("../../middleware/authMiddleware");
const profileController = require("../../controller/adminController/profileController");
const adminRouter = express_1.default.Router();
//GET methods
adminRouter.get("/:profile_id", authMiddleware.isValidAdmin, profileController.getSingleUserByProfileId);
//POST methods
adminRouter.post("/fund_raiser_profile/:profile_id", authMiddleware.isValidAdmin, profileController.getUserByIdsController);
//POST methods
adminRouter.post("/find_users_byids", authMiddleware.isValidAdmin, profileController.getUserByIdsController);
// module.exports = adminRouter;
exports.default = adminRouter;
