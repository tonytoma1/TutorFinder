const nodemailer = require('nodemailer');
const Account = require('../models/account');


require('dotenv').config()


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_EMAIL_PASSWORD
    }
})

async function sendEmail(email, subject, message) {
    let emailSuccessfullySent = false;
    let emailSent = undefined;
    let error = undefined;

    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: subject,
        text: message
    }

    try {
        emailSent = await transporter.sendMail(mailOptions);
        emailSuccessfullySent = true;
    }
    catch(err) {
       error = err;
    }

    return {emailSent: emailSent, emailSuccessfullySent: emailSuccessfullySent, error: error }
}

// Updates the account's password pin and sends the user an email about the pin.
async function sendUpdatePasswordRequest(email) {
    let messageSent = false;
    let error = undefined;
    try {
        // insert pin into account
        let pin = generatePasswordPin(5);
        await updatePasswordPin(email, pin);
        // Send user an email about the password pin
        let message = "Your password reset pin is: " + pin;
        let subject = "Tutor App: Password Reset Code"
        await sendEmail(email, subject, message);
        messageSent = true;
    }
    catch(err) {
        error = err;
    }

    return {messageSent: messageSent, error: error};

}

function generatePasswordPin(pinLength) {
    let pin = "";
    for(let i = 0; i < pinLength; i++) {
        let digit = Math.floor(Math.random() * 9) + 1
        pin += digit.toString();
    }
    return pin;
}


async function updatePasswordPin(email, pin) {
    let updated = false;
    let error = "";
    let account = undefined;

    if(!pin || !email) {
        error = "pin or email is undefined";
        let result = {updated: updated, account: account, error: error};
        return result;
    }

    try {
        accountFound = await Account.findOne({email: email});
        accountFound.passwordPin = pin;
        account = await accountFound.save();
        updated = true;
    }
    catch(err) {
        error = err;
    }

    let result = {updated: updated, account: account, error: error};

    return result;
}


module.exports = {sendEmail, generatePasswordPin, updatePasswordPin, sendUpdatePasswordRequest}