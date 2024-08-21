import amqplib from 'amqplib';





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
            // reject()
            console.log("Channel not found");

        })
    }
}

export default ProfileConsumer

