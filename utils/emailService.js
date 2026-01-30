const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const sendOTP = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or your preferred SMTP service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const templatePath = path.join(__dirname, 'templates', 'otpTemplate.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');
        htmlContent = htmlContent.replace('[[OTP_CODE]]', otp);

        const mailOptions = {
            from: `"NSM Alumni Association" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email - NSM Alumni Association',
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending OTP:', error);
        return false;
    }
};

module.exports = { sendOTP };
