"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require("express");
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const adminController_1 = __importDefault(require("../controller/adminController"));
const adminRouter = express_1.default.Router();
const authMiddleware = new authMiddleware_1.default();
const adminController = new adminController_1.default();
//GET methods
adminRouter.get("/:profile_id", authMiddleware.isValidAdmin, adminController.getSingleUserByProfileId);
//POST methods
// adminRouter.post("/fund_raiser_profile/:profile_id", authMiddleware.isValidAdmin, profileController.getUserByIdsController)
//POST methods
adminRouter.post("/find_users_byids", authMiddleware.isValidAdmin, adminController.getUserByIdsController);
// module.exports = adminRouter;
exports.default = adminRouter;
