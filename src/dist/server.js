"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bulkConsumer_1 = __importDefault(require("./src/communication/bulkConsumer"));
const app = (0, express_1.default)();
//middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("combined"));
dotenv_1.default.config({ path: "./.env" });
(0, bulkConsumer_1.default)();
const connection_1 = __importDefault(require("./src/database/connection"));
const userRouter_1 = __importDefault(require("./src/router/userRouter"));
const adminRouter_1 = __importDefault(require("./src/router/adminRouter"));
const morgan_1 = __importDefault(require("morgan"));
(0, connection_1.default)();
app.use("/", userRouter_1.default);
app.use("/admin", adminRouter_1.default);
//const
const PORT = parseInt(process.env.PORT || "", 10) || 7004;
app.listen(PORT, () => {
    console.log("Profile started at Port : " + PORT);
});
