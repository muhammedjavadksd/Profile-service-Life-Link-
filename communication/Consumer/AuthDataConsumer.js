const profileHelper = require("../../config/util/helper/profileHelper");
const createConnection = require("../Connection");

async function authDataConsumer() {



    try {
        const queueName = process.env.AUTH_TRANSFER;
        console.log("Queue name is : " + queueName);
        const channel = await createConnection();

        channel.assertQueue(queueName, { durable: true });
        channel.consume(queueName, (msg) => {

            if (msg) {
                console.log("The message is");
                console.log(JSON.parse(msg.content.toString()));
                const data = JSON.parse(msg.content.toString())
                console.log("Auth transfer data");
                console.log(data);

                const insertData = {
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    location: data.location,
                    user_id: data.user_id,
                    phone_number: data.phone_number,
                    profile_id: data.profile_id
                }

                profileHelper.insertUser(insertData)

            }
        }, { noAck: true })
    } catch (e) {
        console.log("Profile consuming error");
        console.log(e);

    }

}

module.exports = authDataConsumer;