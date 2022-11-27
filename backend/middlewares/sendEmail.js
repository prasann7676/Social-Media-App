//This package is used to send mail using node backend
const nodeMailer = require('nodemailer');

//If gmail is not working, then go to setting ans make less secure app access on.(But not remmonded, therefore use the below given code in transporter)

//This options is actually {email:user.email,subject:"Password Reset Token",message}
// called in controllers/user forgetPassword function
exports.sendEmail = async (options)=>{

    //1st step
    // If this is not working, then use this in transporter
    // host: "smtp.mailtrap.io",
    // port: 2525,
    // auth: {
    //     user: "9b174e1ecb8ed9",
    //     pass: "90234d879d2ddb"
    // }
    const transporter = nodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "9b174e1ecb8ed9",
            pass: "90234d879d2ddb"
        }
        // host: process.env.SMPT_HOST,
        // port: process.env.SMPT_PORT,
        // auth:{
        //     user: process.env.SMPT_MAIL,
        //     pass: process.env.SMPT_PASSWORD
        // },
        // service: process.env.SMPT_SERVICE
    });

    //2nd step
    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message,
    }

    //3rd step
    await transporter.sendMail(mailOptions);
}