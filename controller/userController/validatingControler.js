const profileHelper = require("../../config/util/helper/profileHelper");


let validatingControler = {
    profileUpdateOTPSubmission: (req, res, next) => {
        try {

            let otp = req.body.otp_number;
            let allowedOtpTypes = ['EMAIL', 'PHONE'];
            let otp_type = req.body.otp_type;
            let user_id = req.context.user_id;

            if (user_id && otp && otp_type) {
                if (allowedOtpTypes.includes(otp_type)) {
                    profileHelper.validateUpdateProfileOTP(otp, otp_type, user_id).then((data) => {
                        res.status(data.statusCode).json({
                            status: data.status,
                            msg: data.msg
                        })
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            msg: "Something went wrong"
                        })
                    })
                } else {
                    res.status(400).json({
                        status: false,
                        msg: "OTP type is not allowed!"
                    })
                }
            } else {
                res.status(401).json({
                    status: false,
                    msg: "Authentication failed"
                })
            }
        } catch (e) {
            res.status(500).json({
                status: false,
                msg: "Internal Server Error"
            })
        }

    }
}

module.exports = validatingControler;