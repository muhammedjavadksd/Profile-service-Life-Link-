import amqplib from 'amqplib';

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


}

export default ProfileDataProvider;
