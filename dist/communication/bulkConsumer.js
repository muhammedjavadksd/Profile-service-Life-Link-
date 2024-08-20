"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bulkConsumer;
const authDataConsumer = require("./Consumer/AuthDataConsumer");
function bulkConsumer() {
    console.log("Consuming data");
    authDataConsumer();
}
