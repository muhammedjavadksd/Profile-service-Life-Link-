// const profileHelper = require("../config/util/helper/profileHelper");
// const createConnection = require("./Connection");
import amqplib from 'amqplib';



// const insertData = {
//     email: data.email,
//     first_name: data.first_name,
//     last_name: data.last_name,
//     location: data.location,
//     user_id: data.user_id,
//     phone_number: data.phone_number,
//     profile_id: data.profile_id
// }

class ProfileConsumer {
    channel: amqplib.Channel | undefined;
    queue;

    constructor(queueName: string) {
        this.queue = queueName
    }

    async _init__(queueName: string) {
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName);
        this.channel = channel;
    }


    async authDataConsumer(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.channel) {
                this.channel.consume(this.queue, (msg) => {
                    if (msg) {
                        const data = JSON.parse(msg.content.toString())
                        // profileHelper.insertUser(insertData)
                        resolve(data)
                    }
                }, { noAck: true })
            }
            reject()
        })
    }
}

export default ProfileConsumer




// async function authDataConsumer() {



//     try {
//         const queueName = process.env.AUTH_TRANSFER;
//         console.log("Queue name is : " + queueName);
//         const channel = await createConnection();

//         channel.assertQueue(queueName, { durable: true });
//         channel.consume(queueName, (msg) => {

//             if (msg) {
//                 console.log("The message is");
//                 console.log(JSON.parse(msg.content.toString()));
//                 const data = JSON.parse(msg.content.toString())
//                 console.log("Auth transfer data");
//                 console.log(data);

//                 const insertData = {
//                     email: data.email,
//                     first_name: data.first_name,
//                     last_name: data.last_name,
//                     location: data.location,
//                     user_id: data.user_id,
//                     phone_number: data.phone_number,
//                     profile_id: data.profile_id
//                 }

//                 profileHelper.insertUser(insertData)

//             }
//         }, { noAck: true })
//     } catch (e) {
//         console.log("Profile consuming error");
//         console.log(e);

//     }

// }

// module.exports = authDataConsumer;