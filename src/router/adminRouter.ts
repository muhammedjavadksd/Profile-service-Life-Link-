
// const express = require("express");
import express from 'express';
import AuthMiddleware from '../middleware/authMiddleware';
import AdminController from '../controller/adminController';
const adminRouter = express.Router();

const authMiddleware = new AuthMiddleware();
const adminController = new AdminController();


//GET methods
adminRouter.get("/get_tickets/:limit/:page/:status?", authMiddleware.isValidAdmin, adminController.getTickets)
adminRouter.get("/get_ticket/:ticket_id", authMiddleware.isValidAdmin, adminController.getSingleTicket)
adminRouter.get("/presigned_url", authMiddleware.isValidAdmin, adminController.createPresignedUrl)
adminRouter.get("/:profile_id", authMiddleware.isValidAdmin, adminController.getSingleUserByProfileId)

adminRouter.post("/find_users_byids", authMiddleware.isValidAdmin, adminController.getUserByIdsController)

adminRouter.put("/replay_ticket/:ticket_id", authMiddleware.isValidAdmin, adminController.addReplayToChat)

export default adminRouter