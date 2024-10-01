import mongoose, { ObjectId } from 'mongoose';
import ProfileCollection from '../database/models/UserProfile';
import { IProfileEdit, IUserCollection, IUserEditProfile, IUserProfile } from '../util/types/Interface/CollectionInterface';


class UserRepo {

    profileCollection;

    constructor() {
        this.profileCollection = ProfileCollection
    }

    async insertProfile(profile: IUserProfile): Promise<ObjectId | null> {
        const profileInstance = new this.profileCollection(profile);
        const saveProfile = await profileInstance.save();
        return saveProfile?.id
    }

    async findUserByProfileId(profile_id: string): Promise<IUserCollection | null> {
        const singleProfile = await this.profileCollection.findOne({ profile_id })
        return singleProfile
    }

    async findProfileByDonorId(donor_id: string): Promise<IUserCollection | null> {
        const singleProfile = await this.profileCollection.findOne({ blood_donor_id: donor_id })
        return singleProfile
    }

    async findUserByUserId(user_id: string): Promise<IUserCollection | null> {
        const singleProfile = await this.profileCollection.findOne({ user_id })
        return singleProfile
    }

    async findUserProfileByIds(user_ids: mongoose.Types.ObjectId[]): Promise<IUserCollection[] | []> {
        const singleProfile: IUserCollection[] = await this.profileCollection.find({ user_id: { $in: user_ids } })
        return singleProfile
    }

    async findUserByPhoneNumber(phone_number: number): Promise<IUserCollection | null> {
        const singleProfile = await this.profileCollection.findOne({ phone_number })
        return singleProfile
    }


    async findProfileByEmailId(email_id: string): Promise<IUserCollection | null> {
        const singleProfile = await this.profileCollection.findOne({ email: email_id })
        return singleProfile
    }

    async updateProfile(data: IProfileEdit, user_id: string): Promise<boolean> {
        const updateProfile = await this.profileCollection.updateOne({ user_id }, { $set: data });
        return updateProfile.modifiedCount > 0
    }
}

export default UserRepo