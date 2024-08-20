const authDataConsumer = require("./Consumer/AuthDataConsumer")


export default function bulkConsumer() {
    console.log("Consuming data");
    authDataConsumer()
}