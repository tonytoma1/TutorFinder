const {login, createStudentAccount, createTutorAccount, getAllTutors, uploadImageToCloudinary,
    updateAccount, updateTutorAccount, updateProfilePicture} = require('../services/account-service');
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

it('find all tutors, getAllTutors() returns all tutors', async () => {
    const tutorsFound = await getAllTutors();
    expect(tutorsFound).toBeTruthy();
    
})

describe('login endpoint', () => {
    it('given login credentials, router.post("/login") should return status 200', async () => {
        // create an acount
        const subjects = ['math', 'science'];
        const createdAccount = await createStudentAccount('studentlogin@example.com', 'password', 'john', 'doe', subjects);
        const response = await request(app)
                            .post('/api/account/login')
                            .send({
                                email: createdAccount.email,
                                password: 'password'
                            });
        expect(response.status).toBe(200);
        
        
    }, 30000)
});


describe('Register for an account', () => {
    it('given student information, router.post("/register-student") should return status 200', async () => {
        const subjects = ['math', 'science'];
        const response = await request(app)
                                .post('/api/account/register-student')
                                .send({
                                    email: 'registerstudent@example.com',
                                    password: 'password',
                                    firstName: 'student',
                                    lastName: 'test',
                                    subjects: subjects
                                });
        expect(response.status).toBe(200);
    })
    it('given tutor information, router.post("/register-tutor") should return status 200', async () => {
        const subjects = ['math', 'science'];
        const response = await request(app)
                               .post('/api/account/register-tutor')
                               .send({
                                    email: 'registertutor@example.com',
                                    password: 'password',
                                    firstName: 'student',
                                    lastName: 'test',
                                    jobTitle: 'Engineer',
                                    subjects: subjects,
                                    price: 20
                            });
        expect(response.status).toBe(200);
    })
   
})

it("Given image url, uploadImage() successfully uploads image to hosting platform (cloudinary etc), returns the image url", async () => {
    let imageUrl = "https://cdn.the-scientist.com/assets/articleNo/66864/aImg/35078/foresttb-l.jpg";
    let result = await uploadImageToCloudinary(imageUrl);
    expect(result).toBeTruthy();

})

it("Given not valid url, uploadImage() return empty string", async () => {
    let imageUrl = "";
    let result = await uploadImageToCloudinary(imageUrl);
    expect(result).toBeFalsy();
})

describe('Update account', () => {
    it('given the correct account information, updateAccount() return true', async () => {
        let subjects = ['linear algebra', 'math', 'science'];
        const response = await createStudentAccount('notUpdatedAccount@example.com', 'password', 'John', 'Doe', subjects);
        let accountId = response.id;
        let firstName = 'tom'
        let lastName = "harry"
        let email = "updatedAccount@example.com"
        const result = await updateAccount(accountId, firstName, lastName, email)
        
        expect(result.accountUpdated).toBeTruthy();
    })

    it('given incorrect account id, updateAccount() return false', async () => {
        let accountId = "1";
        let firstName = 'tom'
        let lastName = "harry"
        let email = "newExample@example.com"
        const result = await updateAccount(accountId, firstName, lastName, email)

        expect(result.accountUpdated).toBeFalsy();
    })

    it('Given tutor information, updateTutorAccount() return updated tutor account', async () => {
        let subjectsTaught = ['Math', 'Algebra']
        let profileImageUrl = 'https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2017/11/04133712/waterfall.jpg'
        let account = await createTutorAccount("notUpdatedTutor@example.com", "password", "todd", "bob", subjectsTaught,
                                               20, "Accountant");
        expect(account.email).toBe('notUpdatedTutor@example.com');

        let updateResult = await updateTutorAccount(account.id, "todd", "jones", 'updatedTutor@example.com', 
                                                   subjectsTaught, 550, "CPA Accountant", "I have been an accountant for 30 years");

        expect(updateResult.account.email).toBe("updatedTutor@example.com")
        let updatedAccount = await Account.findById(account.id).populate('accountType');
        expect(updatedAccount.accountType.price).toBe(550);
        expect(updatedAccount.accountType.jobTitle).toBe("CPA Accountant")
        

    }, 50000)

    it('Given tutor information that is not in the system, updateTutorAccount() return undefined', async () => {
        let subjectsTaught = ['Math', 'Algebra']
        let account = await createTutorAccount("notUpdatedTutor2@example.com", "password", "todd", "bob", subjectsTaught,
                                               20, "Accountant");
        expect(account.email).toBe('notUpdatedTutor2@example.com');
        // insert incorrect id
        let updateResult = await updateTutorAccount("1", 'updatedTutor@example.com', "password", "bob", "todd", subjectsTaught,
        30, "CPA Accountant");
        expect(updateResult.accountUpdated).toBeFalsy();

    })

    it('Given no tutor information, updateTutorAccount() should return undefined', async () => {
        let updatedResult = await updateTutorAccount();
        expect(updatedResult.account).toBe(undefined);
    })

    it('given tutor information, router.post("/update-tutor-account") return status 200', async () => {
        let subjectsTaught = ['Math', 'Algebra']
        let account = await createTutorAccount("notUpdatedTutor3@example.com", "password", "todd", "bob", subjectsTaught,
                                               20, "Accountant");

        const response = await request(app).post('/api/account/update-tutor-account')
                                            .send({
                                                accountId: account.id,
                                                firstName: "Jon",
                                                lastName: 'Doe',
                                                email: "notUpdatedTutor3@example.com" ,
                                                price: 26,
                                                jobTitle: 'Software Developer',
                                                Description: 'I am a fully qualified developer',
                                                subjects: subjectsTaught
                                            })
        expect(response.status).toBe(200)
    })
    
})

it('given student information, router.post("/update-student-account") return status 200', async () => {
    let account = await createStudentAccount("new@student.com", "password", "Bob", "Jones");
    
    const response = await request(app).post('/api/account/update-student-account')
                                        .send({
                                            accountId: account._id,
                                            firstName: 'Updated',
                                            lastName: 'Student',
                                            email: "new@student.com"
                                        }); 
    expect(response.status).toBe(200);
})

// TODO Finish these test cases
describe('Upload profile picture', () => {

    it('Given a profile picture, updateProfilePicture() returns true with updated account', async () => {
        let subjects = ['Math']
        let createdAccount = await createStudentAccount('example10@example.com', 'password', 'John', 'Doe', subjects);
        let profilePictureUrl = 'https://www.ranchandfarmproperties.com/uploads/blogs/29517/pexels-photo-129539__large.jpg'
        let account = await updateProfilePicture(createdAccount.id, profilePictureUrl)
        expect(account.accountUpdated).toBeTruthy();
        expect(account.savedAccount).toBeTruthy();
    })
    it('Given a empty picture url, updateProfilePicture() returns false', async () => {
        let subjects = ['Math']
        let createdAccount = await createStudentAccount('example11@example.com', 'password', 'John', 'Doe', subjects);
        let profilePictureUrl = ''
        let account = await updateProfilePicture(createdAccount.id, profilePictureUrl)
        expect(account.accountUpdated).toBeFalsy();
        expect(account.savedAccount).toBeFalsy();
    })

    it('Given a profile picture, router.post("/upload-profile-picture") successfully uploads image', async () => {
        
        const subjects = ['math'];
        let createdAccount = await createStudentAccount('example4@example.com', 'password', 'John', 'Doe', subjects);
        
        // login
        const response = await request(app)
        .post('/api/account/login')
        .send({
            email: createdAccount.email,
            password: 'password'
        });

        let tokens = {...cookie.parse(response.headers['set-cookie'][0]), ...cookie.parse(response.headers['set-cookie'][1])}

        let profilePicture = './test_images/land.jpg';
        const uploadResponse = await request(app)
                                .post('/api/account/upload-profile-picture')
                                .attach('profile_picture', profilePicture)
                                .set('Authorization', 'Bearer ' + tokens.access_token);

        expect(uploadResponse.status).toBe(200);
        expect(uploadResponse.body.account).toBeTruthy();
        expect(uploadResponse.body.account.email).toBe(createdAccount.email);

    })    

    it('Given no profile picture, router.post("/api/account/upload-profile-picture"), should return status 400', async () => {
        const subjects = ['math'];
        let createdAccount = await createStudentAccount('example5@example.com', 'password', 'John', 'Doe', subjects);
        
        // login
        const response = await request(app)
        .post('/api/account/login')
        .send({
            email: createdAccount.email,
            password: 'password'
        });

        let tokens = {...cookie.parse(response.headers['set-cookie'][0]), ...cookie.parse(response.headers['set-cookie'][1])}

        const uploadResponse = await request(app)
                                .post('/api/account/upload-profile-picture')
                                .set('Authorization', 'Bearer ' + tokens.access_token);

        expect(uploadResponse.status).toBe(400);
        
    })
})


afterAll((done) => {
    mongoose.connection.close();
    done();
})