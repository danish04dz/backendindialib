const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

async function sendMail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER, // sender address
            to, // list of receivers
            subject, // Subject line
            html, // html body
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending mail:", error);
        throw error;
    }
}

module.exports = { sendMail };
