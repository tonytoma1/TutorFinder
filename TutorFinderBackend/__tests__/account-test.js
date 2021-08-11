const {login, createStudentAccount, createTutorAccount} = require('../services/account-service');
var mongoose = require('mongoose');
const Account = require('../models/account');
const Tutor = require('../models/tutor');
const Student = require('../models/student');
require('dotenv').config()

beforeAll(async () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });

      mongoose.connection.on("connected", (err, res) => {

        console.log("mongoose is connected")
      
      })

       await Account.deleteMany({});
       await Student.deleteMany({});
       await Tutor.deleteMany({});


})

it('given registration credentials, createAccount() returns account', async() => {
    let subjects = ['linear algebra', 'math', 'science'];
    const response = await createStudentAccount('example@example.com', 'password', 'John', 'Doe', subjects);
    expect(response).toBeTruthy();
})

it('given duplicate registration credentials, createAccount() throws error', async() => {
    let subjects = ['linear algebra', 'math', 'science'];
    const response = await createStudentAccount('person@example.com', 'password', 'John', 'Doe', subjects);
    expect(response).toBeTruthy();
    try {
        await createStudentAccount('person@example.com', 'password', 'John', 'Doe', subjects)
        // error wasn't thrown. test failed
        expect(false).toBeTruthy();
    }
    catch(error) {
        // error was thrown. test passed.
        expect(true).toBeTruthy();
    }
})

it('given registration for student without subjects, createStudentAccount() throw error', async () => {
    try {
        await createStudentAccount('lol@example.com', 'password', 'John', 'Doe');
        // test failed. did not throw error
        expect(false).toBeTruthy();
    }
    catch(error) {
        // test passed. threw error
        expect(true).toBeTruthy();

    }
 
})

it('given tutor credentials, createTutorAccount() return account', async () => {
    let subjects = ['math', 'science', 'algebra'];
    const result = await createTutorAccount('tutor@example.com', 'password', 'john', 'Doe', subjects, 20);  
    expect(result).toBeTruthy();
   
})

it('given login credentials, login() returns account', async () => {
    // Create account and then login
    let subjects = ['Math', 'Physics']
    await createStudentAccount('student@example.com', 'password', 'john', 'Doe', subjects);
    expect(await login('student@example.com', 'password')).toBeTruthy();
})


afterAll((done) => {
    mongoose.connection.close();
    done();
})