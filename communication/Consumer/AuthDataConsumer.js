const profileHelper = require("../../config/util/helper/profileHelper");
const createConnection = require("../Connection");

async function authDataConsumer() {

    try {
        let queueName = process.env.AUTH_TRANSFER;
        let channel = await createConnection();

        channel.assertQueue(queueName, { durable: true });
        channel.consume(queueName, (msg) => {

            if (msg) {
                let data = JSON.parse(msg.content.toString())
                console.log("Auth transfer data");
                console.log(data);

                let {
                    email,
                    first_name,
                    last_name,
                    location,
                    phone_number,
                    user_id
                } = data;

                profileHelper.insertUser(data)

            }
        }, { noAck: true })
    } catch (e) {
        console.log("Profile consuming error");
        console.log(e);
    }

}