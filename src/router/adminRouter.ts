
// const express = require("express");
import express from 'express';
import AuthMiddleware from '../middleware/authMiddleware';
import AdminController from '../controller/adminController';
const adminRouter = express.Router();

const authMiddleware = new AuthMiddleware();
const adminController = new AdminController();

//GET methods
adminRouter.get("/:profile_id", authMiddleware.isValidAdmin, adminController.getSingleUserByProfileId)

//POST methods
// adminRouter.post("/fund_raiser_profile/:profile_id", authMiddleware.isValidAdmin, profileController.getUserByIdsController)

//POST methods
adminRouter.post("/find_users_byids", authMiddleware.isValidAdmin, adminController.getUserByIdsController)

// module.exports = adminRouter;
export default adminRouter