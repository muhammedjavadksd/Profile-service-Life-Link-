"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
class ProfileConsumer {
    constructor(queueName) {
        this.queue = queueName;
    }
    _init__(queueName) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield amqplib_1.default.connect("amqp://localhost");
            const channel = yield connection.createChannel();
            yield channel.assertQueue(queueName);
            this.channel = channel;
        });
    }
    authDataConsumer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.channel) {
                    this.channel.consume(this.queue, (msg) => {
                        if (msg) {
                            const data = JSON.parse(msg.content.toString());
                            // profileHelper.insertUser(insertData)
                            resolve(data);
                        }
                    }, { noAck: true });
                }
                // reject()
                console.log("Channel not found");
            });
        });
    }
}
exports.default = ProfileConsumer;
