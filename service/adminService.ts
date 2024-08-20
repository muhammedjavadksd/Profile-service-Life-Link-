import mongoose from "mongoose";
import UserRepo from "../repo/userRepo";
import { HelperFunctionResponse } from "../util/types/Interface/UtilInterface";
import { StatusCode } from "../util/types/Enum/UtilEnum";

class AdminService {


    userRepo;

    constructor() {
        this.userRepo = new UserRepo()
    }

    async getProfileByIds(ids: string): Promise<HelperFunctionResponse> {
        const profileIds: string[] = JSON.parse(ids);
        const objectIds = profileIds.map(id => new mongoose.Types.ObjectId(id));
        const allUsers = await this.userRepo.findUserProfileByIds(objectIds)
        if (allUsers.length) {
            return {
                msg: "User profile found",
                status: true,
                statusCode: StatusCode.OK,
                data: {
                    profiles: allUsers
                }
            }
        } else {
            return {
                msg: "No profile found",
                status: false,
                statusCode: StatusCode.NOT_FOUND,
            }
        }
    }

    async getSingleProfileByProfileId(profile_id: string): Promise<HelperFunctionResponse> {
        const singleProfile = await this.userRepo.findUserByUserId(profile_id) //UserProfileModel.findOne({ profile_id });
        if (singleProfile) {
            return {
                msg: "Profile found",
                status: true,
                statusCode: StatusCode.OK,
                data: {
                    profile: singleProfile
                }
            }
        } else {
            return {
                msg: "No profile found",
                status: false,
                statusCode: StatusCode.NOT_FOUND,
            }
        }
    }
}

export default AdminService;
