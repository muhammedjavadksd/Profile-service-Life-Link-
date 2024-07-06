
//Imports
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bulkConsumer = require("./communication/bulkConsumer");
const cors = require("cors")

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


dotenv.config("./.env");
bulkConsumer()


const profileDatabseConnection = require("./config/db/connection");
const userRouter = require("./router/userRouter/index")
const adminRouter = require("./router/adminRouter/index")
const logger = require("morgan");
// const bcrypt = require("bcrypt")
//Config
app.use(logger("common"))
profileDatabseConnection()


app.use("/", userRouter)
app.use("/admin", adminRouter)


//const
const PORT = process.env.PORT || 7004




app.listen(PORT, () => {
    console.log("Profile started at Port : " + PORT)
})