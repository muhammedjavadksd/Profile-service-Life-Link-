const { default: mongoose } = require("mongoose")

function profileDatabseConnection() {
    console.log(process.env.MONGO_URL)
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }).then(() => {
        console.log("Profile database has been connected")
    }).catch((err) => { 
        console.log("Profile database has been failed");
    })
}

module.exports = profileDatabseConnection