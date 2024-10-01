import { Request, Response } from "express";
import { CustomRequest } from "../util/types/CustomeType";
import UserProfileService from "../service/userService";
import { HelperFunctionResponse } from "../util/types/Interface/UtilInterface";
import { AuthUpdateType, CreateChatVia, S3Folder, StatusCode } from "../util/types/Enum/UtilEnum";
import ChatService from "../service/chatService";
import ImageService from "../service/imageService";


class UserProfileController {

    userProfileService;
    chatService;
    imageService;

    constructor() {
        this.getProfile = this.getProfile.bind(this)
        this.updateProfile = this.updateProfile.bind(this)
        this.updatePhoneNumber = this.updatePhoneNumber.bind(this)
        this.updateEmailID = this.updateEmailID.bind(this)
        this.profilePictureUpdation = this.profilePictureUpdation.bind(this)
        this.profileUpdateOTPSubmission = this.profileUpdateOTPSubmission.bind(this)
        this.createChat = this.createChat.bind(this)
        this.addMessageToChat = this.addMessageToChat.bind(this)
        this.blockStatus = this.blockStatus.bind(this)
        this.getMyChats = this.getMyChats.bind(this)
        this.getSingleChat = this.getSingleChat.bind(this)
        this.getPresignedUrl = this.getPresignedUrl.bind(this)
        this.seenMessage = this.seenMessage.bind(this)
        this.userProfileService = new UserProfileService();
        this.chatService = new ChatService();
        this.imageService = new ImageService()
    }

    async seenMessage(req: CustomRequest, res: Response): Promise<void> {

        const room_id: string = req.params.room_id;
        const user_id: string | undefined = req.context?.profile_id;

        console.log("Message seen update");


        if (user_id) {
            const updateSeen = await this.chatService.seenMessage(room_id, user_id);
            res.status(updateSeen.statusCode).json({ status: updateSeen.status, msg: updateSeen.msg, data: updateSeen.data });
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Authentication failed" })
        }
    }

    async getPresignedUrl(req: Request, res: Response): Promise<void> {
        const fileName = req.query.file;
        if (fileName) {
            const signedUrl = await this.imageService.createPresignedUrl(fileName.toString(), process.env.TICKET_ATTACHMENT_BUCKET || "", S3Folder.TicktAttachment);
            res.status(signedUrl.statusCode).json({ status: signedUrl.status, msg: signedUrl.msg, data: signedUrl.data })
        } else {
            res.status(StatusCode.BAD_REQUEST).json({ status: false, msg: "Something went wrong" })
        }
    }

    async getProfile(req: CustomRequest, res: Response) {
        const email_id = req.context?.email_id;
        const findProfile = await this.userProfileService.getSingleProfileByEmail(email_id); //profileHelper.getSingleProfile(email_id);
        res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data })
    }

    async updateProfile(req: CustomRequest, res: Response) {

        const userProfile = req.body.user_profile;
        if (!req.context) {
            res.status(StatusCode.BAD_REQUEST).json({ status: false, msg: "Profile not found" })
            return;
        }
        const user_id = req.context.user_id;

        const updateProfile: HelperFunctionResponse = await this.userProfileService.updateProfile(userProfile, user_id);
        res.status(updateProfile.statusCode).json({ status: updateProfile.status, msg: updateProfile.msg, data: updateProfile.data })
    }

    async updatePhoneNumber(req: CustomRequest, res: Response) {

        const new_phone_number: number = req.body.new_phone_number;
        const user_id = req.context?.user_id;

        if (new_phone_number && user_id) {

            const updatePhoneNumber = await this.userProfileService.updatePhoneNumber(new_phone_number, user_id);

            res.status(updatePhoneNumber.statusCode).json({
                status: updatePhoneNumber.status,
                msg: updatePhoneNumber.msg
            })
        } else {
            res.status(StatusCode.BAD_REQUEST).json({
                status: false,
                msg: "Please provide a phone number"
            })
        }
    }

    async updateEmailID(req: CustomRequest, res: Response) {

        const new_email_id: string = req.body.new_email_id;
        const user_id: string | undefined = req.context?.user_id;

        if (new_email_id && user_id) {
            const updateEmailID = await this.userProfileService.updateEmailId(new_email_id, user_id);
            console.log(updateEmailID);
            res.status(updateEmailID.statusCode).json({
                status: updateEmailID.status,
                msg: updateEmailID.msg
            })
        } else {
            res.status(400).json({
                status: false,
                msg: "Please provide a phone number"
            })
        }
    }

    async profilePictureUpdation(req: CustomRequest, res: Response) {

        //     const user_id = req.context?.user_id;
        //     const profilePicture = req.fil.profile_picture;

        //     if (user_id && profilePicture) {
        //         const updateProfilePicture = await profileHelper.updateProfilePicture(user_id, profilePicture);
        //         res.status(updateProfilePicture.statusCode).json({
        //             status: updateProfilePicture.statusCode,
        //             msg: updateProfilePicture.msg
        //         })
        //     } else {
        //         res.status(400).json({
        //             status: false,
        //             msg: "Please provide valid image"
        //         })
        //     }
        // } catch(e) {
        //     res.status(500).json({
        //         status: 500,
        //         msg: "Internal Server Error"
        //     })
        // }
    }


    async profileUpdateOTPSubmission(req: CustomRequest, res: Response) {

        const otp: number = req.body.otp_number;
        const allowedOtpTypes: string[] = ['EMAIL', 'PHONE'];
        const otp_type: AuthUpdateType = req.body.otp_type;
        const user_id = req.context?.user_id;

        if (user_id && otp && otp_type) {
            if (allowedOtpTypes.includes(otp_type)) {
                const validateOtp = await this.userProfileService.validateUpdateProfileOTP(otp, otp_type, user_id);
                res.status(validateOtp.statusCode).json({
                    status: validateOtp.status,
                    msg: validateOtp.msg
                })
            } else {
                res.status(StatusCode.BAD_REQUEST).json({
                    status: false,
                    msg: "OTP type is not allowed!"
                })
            }
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({
                status: false,
                msg: "Authentication failed"
            })
        }
    }



    async createChat(req: CustomRequest, res: Response) {

        const context = req.context;
        if (context) {
            const profile_id = context.profile_id;
            const second_profile = req.body.to_profile;
            const msg = req.body.msg;
            const via: CreateChatVia = req.params.via as unknown as CreateChatVia;

            const createChat: HelperFunctionResponse = await this.chatService.startChat(profile_id, second_profile, msg, via);
            res.status(createChat.statusCode).json({ status: createChat.status, msg: createChat.msg, data: createChat.data })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un authraized access", })
        }
    }

    async addMessageToChat(req: CustomRequest, res: Response): Promise<void> {
        const msg: string = req.body.message;
        const room_id: string = req.params.room_id;
        const context = req.context;
        if (context) {
            const profile_id: string = context.profile_id;
            if (profile_id) {
                const addMessage = await this.chatService.addMessage(room_id, msg, profile_id);
                res.status(addMessage.statusCode).json({ status: addMessage.status, msg: addMessage.msg, data: addMessage.data })
                return;
            }
        }
        res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un authraized access", })
    }

    async blockStatus(req: CustomRequest, res: Response): Promise<void> {
        const room_id: string = req.params.room_id;
        const status: string = req.params.status;
        const context = req.context;
        if (context) {

            console.log("The public context");
            console.log(status);

            const profile_id: string = context.profile_id;
            if (profile_id) {
                if (status == "block") {
                    const blockRoom = await this.chatService.blockChat(room_id, profile_id)
                    res.status(blockRoom.statusCode).json({ status: blockRoom.status, msg: blockRoom.msg, data: blockRoom.data })
                    return;
                } else {
                    const blockRoom = await this.chatService.unBlockChat(room_id, profile_id)
                    res.status(blockRoom.statusCode).json({ status: blockRoom.status, msg: blockRoom.msg, data: blockRoom.data })
                    return;
                }
            }
        }

        res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un authraized access", })
    }


    async getMyChats(req: CustomRequest, res: Response): Promise<void> {

        const context = req.context;
        if (context) {
            const profile_id = context?.profile_id;
            if (profile_id) {
                const myChats = await this.chatService.getMyChats(profile_id);
                res.status(myChats.statusCode).json({ status: myChats.status, msg: myChats.msg, data: myChats.data })
                return;
            }
        }
        res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un authraized access", })
    }

    async getSingleChat(req: CustomRequest, res: Response): Promise<void> {

        const profile_id: string = req.context?.profile_id
        const chat_id: string = req.params.room_id


        console.log("Finding single chat");


        if (profile_id && chat_id) {
            const findChat = await this.chatService.getSingleChat(chat_id, profile_id);
            res.status(findChat.statusCode).json({ status: findChat.status, msg: findChat.msg, data: findChat.data })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthraized access" })
        }
    }

}

export default UserProfileController

