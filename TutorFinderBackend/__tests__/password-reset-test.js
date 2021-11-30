const {login, createStudentAccount, createTutorAccount, getAllTutors, uploadImageToCloudinary,
    updateAccount, updateTutorAccount, updateProfilePicture} = require('../services/account-service');
const {sendEmail, generatePasswordPin, updatePasswordPin, sendUpdatePasswordRequest, comparePasswordPins} = require('../services/email-service')
var mongoose = require('mongoose');
const Account = require('../models/account');
const Tutor = require('../models/tutor');
const Student = require('../models/student');
const request = require('supertest');
const express = require('express');
const app = require('../app');
const cookie = require ('cookie');
require('dotenv').config()


beforeAll(async () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    mongoose.connection.on("connected", (err, res) => {
    })
    await Account.deleteMany({});
    await Student.deleteMany({});
    await Tutor.deleteMany({});
})

it('given a password pin, router.post(/password-pin/email/pin) return status 200', async () => {
    const email = 'student1234@gmail.com'
    const pin = generatePasswordPin(5);
    let subjects = ['linear algebra', 'math', 'science'];
    await createStudentAccount(email, 'password', 'John', 'Doe', subjects);
    await updatePasswordPin(email, pin);

    const response = await request(app)
        .post(`/api/account/password-pin/${email}/${pin}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("pins_match");
})

it('given an incorrect password pin, router.post(/password-pin/email/pin) return status 400', async () => {
    const email = 'student123456789@gmail.com'
    const pin = generatePasswordPin(5);
    let subjects = ['linear algebra', 'math', 'science'];
    await createStudentAccount(email, 'password', 'John', 'Doe', subjects);
    await updatePasswordPin(email, pin);

    const response = await request(app)
        .post(`/api/account/password-pin/${email}/123`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("incorrect pin");
})