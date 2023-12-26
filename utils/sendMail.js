const nodemailer = require("nodemailer");
exports.sendMail = async function(options){
    const transporter = nodemailer.createTransport({
        host : "sandbox.smtp.mailtrap.io",
        port : 2525,
        auth : {
            user : "d3935386be2675",
            pass : "6f349b2a1bf6ef"
        }
    });
    const message = await transporter.sendMail({
        from : "reset@algomingle.com",
        to : options.email,
        subject : options.subject,
        text : options.message,
        html : `
        This is password link send from AlgoMingle.com 
        <a href=${options.message}>Click here to reset the password</a>`
    })
    await transporter.sendMail(message);
}