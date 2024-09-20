import express, { Express } from 'express';
import dotenv from 'dotenv'
import bulkConsumer from './src/communication/bulkConsumer'
import logger from 'morgan'
import { Server } from 'socket.io'



const app: Express = express()
const io = new Server({
    cors: {
        origin: "*"
    }
})

// ChatHelper()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger("combined"))

dotenv.config({ path: "./.env" });
bulkConsumer()

import profileMongoConnection from './src/database/connection'
import userRouter from './src/router/userRouter';
import adminRouter from './src/router/adminRouter'
import ChatHelper from './src/helper/chatHelper';


profileMongoConnection()

app.use("/", userRouter)
app.use("/admin", adminRouter)

//const
const PORT: number = parseInt(process.env.PORT || "", 10) || 7004

app.listen(PORT, () => {
    console.log("Profile started at Port : " + PORT)
})