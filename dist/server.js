"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bulkConsumer_1 = __importDefault(require("./src/communication/bulkConsumer"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const chatHelper_1 = __importDefault(require("./src/helper/chatHelper"));
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const webServer = new socket_io_1.Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "https://life-link.online", "https://www.life-link.online"],
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://life-link.online", "https://www.life-link.online"]
}));
(0, chatHelper_1.default)(webServer);
//middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use(logger("combined"))
dotenv_1.default.config({ path: "./.env" });
(0, bulkConsumer_1.default)();
const connection_1 = __importDefault(require("./src/database/connection"));
const userRouter_1 = __importDefault(require("./src/router/userRouter"));
const adminRouter_1 = __importDefault(require("./src/router/adminRouter"));
(0, connection_1.default)();
app.use("/", userRouter_1.default);
app.use("/admin", adminRouter_1.default);
//const
const PORT = parseInt(process.env.PORT || "", 10) || 7004;
httpServer.listen(PORT, () => {
    console.log("Profile started at Port : " + PORT);
});
