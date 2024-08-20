import { ObjectId } from 'mongoose';
import ProfileCollection from '../database/models/UserProfile';
import { IUserCollection, IUserProfile } from '../util/types/Interface/CollectionInterface';


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


    async findProfileByEmailId(email_id: string): Promise<IUserCollection | null> {
        const singleProfile = await this.profileCollection.findOne({ email: email_id })
        return singleProfile
    }
}

export default UserRepo