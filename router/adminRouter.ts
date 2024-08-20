
// const express = require("express");
import express from 'express';
import AuthMiddleware from '../middleware/authMiddleware';
// const authMiddleware = require("../../middleware/authMiddleware");
const profileController = require("../../controller/adminController/profileController");
const adminRouter = express.Router();

const authMiddleware = new AuthMiddleware();

//GET methods
adminRouter.get("/:profile_id", authMiddleware.isValidAdmin, profileController.getSingleUserByProfileId)

//POST methods
adminRouter.post("/fund_raiser_profile/:profile_id", authMiddleware.isValidAdmin, profileController.getUserByIdsController)

//POST methods
adminRouter.post("/find_users_byids", authMiddleware.isValidAdmin, profileController.getUserByIdsController)

// module.exports = adminRouter;
export default adminRouter