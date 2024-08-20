// const { default: mongoose } = require("mongoose")
import mongoose from "mongoose";

function profileDatabseConnection() {
    mongoose.connect(process.env.MONGO_URL || "").then(() => {
        console.log("Profile database has been connected")
    }).catch((err: string) => {
        console.log(err);
        console.log("Profile database has been failed");
    })
}

export default profileDatabseConnection
