



function createUser() {

    //Find user is a user object
    findUser.save().then(() => {
        console.log("All done");
        return {
            statusCode: 200,
            status: true,
            msg: "OTP has been sent to mail"
        }
    }).catch((e) => {
        console.log(e);
        return {
            statusCode: 500,
            status: false,
            msg: "Something went wrong"
        }
    })
}

const userOutput = createUser();
console.log(userOutput.statusCode)