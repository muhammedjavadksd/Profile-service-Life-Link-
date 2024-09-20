// const authDataConsumer = require("./Consumer/AuthDataConsumer")

import UserProfileService from "../service/userService";
import { IUserProfile } from "../util/types/Interface/CollectionInterface";
import ProfileConsumer from "./AuthDataConsumer"

export default async function bulkConsumer() {

    const profileConsumer = new ProfileConsumer(process.env.AUTH_TRANSFER || "");
    await profileConsumer._init__()

    console.log("Bulk consumer");

    await profileConsumer.authDataConsumer() as unknown as IUserProfile;
    // userProfileService.createUser(data);

    // authDataConsumer()
}