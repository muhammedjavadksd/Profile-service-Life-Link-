// const fundRaisingHelper = require("../../../fund raising/util/helper/fundRaiserHelper");
const profileHelper = require("../../config/util/helper/profileHelper");


const profileController = {

    getSingleUserByProfileId: async (req, res) => {

        const profile_id = req.params.profile_id;
        if (profile_id) {
            const findProfile = await profileHelper.getSingleProfileByProfileId(profile_id);
            if (findProfile) {
                res.status(200).json({ status: true, msg: "Data fetched success", data: { profile: findProfile } })
            } else {
                res.status(404).json({ status: false, msg: "No profile found" })
            }
        } else {
            res.status(400).json({ status: false, msg: "Please provide valid profile id" })
        }
    },

    getUserByIdsController: async (req, res, next) => {

        try {
            const user_ids = req.body.user_ids;

            console.log(req.body);

            console.log("Requsted profile ids");
            console.log(user_ids);

            if (user_ids?.length) {

                const findProfiles = await profileHelper.getProfileByIds(user_ids)
                console.log(findProfiles);
                if (findProfiles?.length) {
                    res.status(200).json({ status: true, profile: findProfiles })
                } else {
                    res.status(404).json({ status: false, msg: "No profile found" })
                }
            } else {
                res.status(404).json({ status: false, msg: "Provide valid user ids" })
            }
        } catch (e) {
            console.log(e);
            console.log("error");
            res.status(500).json({ status: false, msg: "Something went wrong" })
        }
    },


    // getFundRaiserProfile: async (req, res) => {
    //     let fund_raiser_profile = req.params.profile_id;

    //     try {

    //         let fundRaiserProfile = await fundRaisingHelper.getSingleFundRaise(fund_raiser_profile);
    //         if (helper) {
    //             res.status(200).json({ status: true, profile: fundRaiserProfile })
    //         } else {
    //             res.status(404).json({ status: false, msg: "Profile not found" })
    //         }
    //     } catch (e) {
    //         res.status(500).json({ status: false, msg: "Something went wrong" })
    //     }
    // }
}

module.exports = profileController;