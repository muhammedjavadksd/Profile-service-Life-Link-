const amqplib = require("amqplib")

const ProfileDataProvider = {

    _getChannel: async (queueName) => {

        try {
            const connection = await amqplib.connect("amqp://localhost");
            const channel = await connection.createChannel();
            channel.assertQueue(queueName)
            return channel
        } catch (e) {
            console.log(e);
            return null;
        }
    },

    updateAuthData: async function (data) {

        const queueName = process.env.AUTH_DATA_UPDATE_QUEUE;
        try {
            const channel = await this._getChannel(queueName);
            if (channel) {
                channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
                console.log("Auth data has been transfered");
            } else {
                console.log("Channel creation failed");
            }
        } catch (e) {
            console.log(e);
            console.log("Something wrong for sending auth data udation");
        }

    },


    profileUpdateNotification: async function (email_id, type, otp, full_name) {

        const queueName = process.env.EMAIL_PROFILE_UPDATE_OTP;
        try {

            const channel = await this._getChannel(queueName);
            if (channel) {
                channel.sendToQueue(queueName, Buffer.from(JSON.stringify({
                    email_id,
                    type,
                    otp,
                    full_name
                })))
                console.log("Profile update message provided");
            } else {
                console.log("Profile update message failed");
            }
        } catch (e) {
            console.log(e);
            console.log("Profile update message failed");
        }
    }
}

module.exports = ProfileDataProvider;