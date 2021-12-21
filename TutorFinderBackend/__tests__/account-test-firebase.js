const {updateFirebaseToken, getFirebaseToken, createStudentAccount} = require('../services/account-service');
var mongoose = require('mongoose');
const Account = require('../models/account');
const Tutor = require('../models/tutor');
const Student = require('../models/student');
const express = require('express');
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

describe("Firebase", () => {
    it("given a firebase token, updateFirebaseToken() returns true", async () => {
        const token = 'tifRoKWyTdmbea8CtdV5TI:LQN91bHk8l_PkI5ixt2onqPT9FHj7LoDDB-We1pDMZEYaX2PYHVrACe9PstpJWLDwzBOcUXys9JYtM3RFbM25MoCtJB50WkeNkA-vBgM6Z2AwDhZXN8hDLk01m4B-EzULBN-Wa_u7FQe'
        const account = await createStudentAccount("firebase1@example.com", "password", "Tony", "Toma");
        expect(await updateFirebaseToken(account.id, token)).toBeTruthy();
    })
    it("given empty and null firebase token, updateFirebaseToken() returns false", async () => {
        const account = await createStudentAccount("firebase2@example.com", "password", "Tony", "Toma");
        expect(await updateFirebaseToken(account.id, "")).toBeFalsy();
        expect(await updateFirebaseToken(account.id, null)).toBeFalsy();
    })
    it("given an account id, getFirebaseToken() returns firebase token", async () => {
        const account = await createStudentAccount("firebase3@example.com", "password", "Tony", "Toma");
        const token = 'tifRoKWyTdmbea8CtdV5TI:LQN91bHk8l_PkI5ixt2onqPT9FHj7LoDDB-We1pDMZEYaX2PYHVrACe9PstpJWLDwzBOcUXys9JYtM3RFbM25MoCtJB50WkeNkA-vBgM6Z2AwDhZXN8hDLk01m4B-EzULBN-Wa_u7FQe'

        await updateFirebaseToken(account.id, token);
        let result = await getFirebaseToken(account.id)
        expect(result).toBeTruthy();
        expect(result).toMatch(token);
    })
    it("given an account with no saved firebase token, updateFirebaseToken() returns null", async () => {
        const account = await createStudentAccount("firebasenotoken@example.com", "password", "John", "Doe")
        expect(await getFirebaseToken(account.id)).toBeFalsy();
    })
    it('given an invalid account id, getFirebaseToken() returns null', async () => {
        expect(await getFirebaseToken("123")).toBeFalsy();
    })
    it("given invalid account id, updateFirebaseToken() returns false", async () => {
        expect(await updateFirebaseToken("1", "3435353")).toBeFalsy();
    })

})
