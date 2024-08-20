
// const express = require("express");
import express from 'express';
import AuthMiddleware from '../middleware/authMiddleware';
import AdminController from '../controller/adminController';
const adminRouter = express.Router();

const authMiddleware = new AuthMiddleware();
const adminController = new AdminController();

//GET methods
adminRouter.get("/:profile_id", authMiddleware.isValidAdmin, adminController.getSingleUserByProfileId)
adminRouter.get("/get_tickets/:page/:limit", authMiddleware.isValidAdmin, adminController.getTickets)
adminRouter.get("/get_ticket/:ticket_id", authMiddleware.isValidAdmin, adminController.getSingleTicket)

//POST methods
// adminRouter.post("/fund_raiser_profile/:profile_id", authMiddleware.isValidAdmin, profileController.getUserByIdsController)

//POST methods
adminRouter.post("/find_users_byids", authMiddleware.isValidAdmin, adminController.getUserByIdsController)

adminRouter.patch("/replay_ticket/:ticket_id", authMiddleware.isValidAdmin),

// module.exports = adminRouter;
export default adminRouter