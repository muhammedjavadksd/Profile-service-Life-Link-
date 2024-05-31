let amqplib = require("amqplib");

async function createConnection() {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    return channel;
}

module.exports = createConnection