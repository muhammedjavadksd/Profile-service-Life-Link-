import amqplib from 'amqplib';

// const queueName = process.env.AUTH_DATA_UPDATE_QUEUE!;

class ProfileDataProvider {


    channel: amqplib.Channel | undefined;
    queue;

    constructor(queueName: string) {
        this.queue = queueName
    }

    async _init__(queueName: string) {
        const connection = await amqplib.connect(process.env.RABBITMQ_URL || "");
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName);
        this.channel = channel;
    }

    transferData(data: any): boolean {
        if (this.channel) {
            this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)));
            return true
        } else {
            console.log("Connection not found");
            return false
        }
    }

    // async profileUpdateNotification(data: object) {
    //     const queueName = process.env.EMAIL_PROFILE_UPDATE_OTP!;
    //     try {
    //         const channel = await this._getChannel(queueName);
    //         if (channel) {
    //             channel.sendToQueue(queueName, Buffer.from(JSON.stringify({
    //                 email_id,
    //                 type,
    //                 otp,
    //                 full_name
    //             })));
    //             console.log("Profile update message provided");
    //         } else {
    //             console.log("Profile update message failed");
    //         }
    //     } catch (e) {
    //         console.error(e);
    //         console.log("Profile update message failed");
    //     }
    // }
}

export default ProfileDataProvider;
