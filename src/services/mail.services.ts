import * as nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER_NAME,
        pass: process.env.MAIL_PASSWORD
    }
});


export const sendMail = async (to: string, subject: string, text: string) => {
    const info = await transporter.sendMail({
        from: '"OTP" <rishabh@yopmail.com>', // sender address
        to, // recipient
        subject, // Subject line
        text, // plain text body
    });

    console.log('Message sent: %s', info.messageId);
};