let amqplib = require("amqplib")

let ProfileDataProvider = {

    _getChannel: async (queueName) => {

        try {
            let connection = await amqplib.connect("amqp://localhost");
            let channel = await connection.createChannel();
            channel.assertQueue(queueName)
            return channel
        } catch (e) {
            console.log(e);
            return null;
        }
    },

    updateAuthData: async function (data) {

        let queueName = process.env.AUTH_DATA_UPDATE_QUEUE;
        try {
            let channel = await this._getChannel(queueName);
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


    profileUpdateNotification: async (email_id, type, otp, full_name) => {

        let queueName = process.env.EMAIL_PROFILE_UPDATE_OTP;
        try {

            let channel = await this._getChannel(queueName);
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