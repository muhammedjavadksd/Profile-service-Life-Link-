import amqplib from 'amqplib';
import UserProfileService from '../service/userService';





class ProfileConsumer {
    channel: amqplib.Channel | undefined;
    queue;

    constructor(queueName: string) {
        this.queue = queueName
    }

    async _init__() {
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();
        await channel.assertQueue(this.queue);
        // console.log(channel);
        this.channel = channel;
        console.log("Queue name : ", this.queue);
        console.log(this.channel ? "F" : "NF");
    }


    async authDataConsumer(): Promise<void> {
        return new Promise((resolve, reject) => {

            if (this.channel) {
                this.channel.consume(this.queue, async (msg) => {
                    console.log("Enterd");

                    if (msg) {
                        console.log("Msg found");

                        const repo = new UserProfileService()
                        const data = JSON.parse(msg.content.toString())
                        // profileHelper.insertUser(insertData)
                        const insertUser = await repo.createUser(data);
                        console.log(insertUser);
                        resolve(data)
                    } else {
                        console.log("No msg");

                    }
                }, { noAck: true })
            }
            // reject()
            console.log("Channel not found");

        })
    }
}

export default ProfileConsumer

