import express, { Express, NextFunction, Request } from 'express';
import dotenv from 'dotenv'
import bulkConsumer from './src/communication/bulkConsumer'
import logger from 'morgan'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors';
import ChatHelper from './src/helper/chatHelper';


const app: Express = express()
const httpServer = http.createServer(app);

const webServer: Server = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "https://life-link.online", "https://www.life-link.online"],
        methods: ["GET", "POST"],
        credentials: true
    }
})

app.use(cors({
    origin: ["http://localhost:3000", "https://life-link.online", "https://www.life-link.online"]
}))


ChatHelper(webServer)

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger("combined"))

dotenv.config({ path: "./.env" });
bulkConsumer()

import profileMongoConnection from './src/database/connection'
import userRouter from './src/router/userRouter';
import adminRouter from './src/router/adminRouter'


profileMongoConnection()



app.use("/", userRouter)
app.use("/admin", adminRouter)

//const
const PORT: number = parseInt(process.env.PORT || "", 10) || 7004




httpServer.listen(PORT, () => {
    console.log("Profile started at Port : " + PORT)
})