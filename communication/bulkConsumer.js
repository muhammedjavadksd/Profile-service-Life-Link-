const authDataConsumer = require("./Consumer/AuthDataConsumer")


module.exports = function bulkConsumer() {
    console.log("Consuming data");
    authDataConsumer()
}