
const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const profileController = require("../../controller/adminController/profileController");
const adminRouter = express.Router();

//GET methods
adminRouter.post("/profile/:profile_id", authMiddleware.isValidAdmin, profileController.getSingleUserByProfileId)

//POST methods
adminRouter.post("/fund_raiser_profile/:profile_id", authMiddleware.isValidAdmin, profileController.getUserByIdsController)

//POST methods
adminRouter.post("/find_users_byids", authMiddleware.isValidAdmin, profileController.getUserByIdsController)

module.exports = adminRouter;