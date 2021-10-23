const Account = require('../models/account');
const Student = require('../models/student');
const Tutor = require('../models/tutor');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
let cloudinary = require('cloudinary').v2;
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

async function createStudentAccount(email, password, firstName, lastName) {
    const student = new Student({
      
    });
    const savedStudent = await student.save();

    const account = new Account({
        email: email,
        password: bcrypt.hashSync(password, 10),
        firstName: firstName,
        lastName: lastName,
        accountType: savedStudent.id,
        onModel: 'Student'
    });

   return await account.save();
}

async function createTutorAccount(email, password, firstName, lastName, subjects, price, jobTitle) {
    const tutor = new Tutor({
        subjects: subjects,
        price, price,
        jobTitle: jobTitle
    });
    const savedTutor = await tutor.save();

    const account = new Account({
        email: email,
        password: bcrypt.hashSync(password, 10),
        firstName: firstName,
        lastName: lastName,
        accountType: savedTutor.id,
        onModel: 'Tutor'
    });

    return await account.save();
    
}


async function login(email, password) {
    const account = await Account.findOne({email: email}).populate('accountType')

    if(account == null) {
        throw new Error({code: 'account_not_found'});
    }

    if(!bcrypt.compareSync(password, account.password)) {
        throw new Error({code: 'incorrect_password'});
    }

    return account;

}

async function getAllTutors() {
    const tutors = await Account.find({onModel: 'Tutor'}).populate('accountType').select('-password');
    
    if(tutors == null) {
        throw new Error({code: 'no_tutors_found'});
    }

    return tutors;
}

async function uploadImageToCloudinary(imageUrl) {
    let uploadedImage = undefined;

    try {
        
        let image = await cloudinary.uploader.upload(imageUrl);
        uploadedImage = image.secure_url;
    }
    catch(error) {
      
    }

    return uploadedImage;
   
}

async function updateAccount(accountId, firstName, lastName, email) {
    let accountUpdated = false
    let account = undefined; 
    let error = undefined;

    let updatedInformation = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }
    
    try {
        account = await Account.findByIdAndUpdate(accountId, updatedInformation, {new: true})
        accountUpdated = true;
    }
    catch(e) {
       error = e;
    }
    return {accountUpdated: accountUpdated, account: account, error: error};
}

async function updateTutorAccount(accountId, firstName, lastName, email, subjectsTaught, price, jobTitle, description) {
    let accountUpdated = false;
    let savedAccount = undefined;
    let error = undefined;
    
    try {
        let account = await Account.findById(accountId)
        let tutorAccount = await Tutor.findById(account.accountType._id);
    
        account.email = email
        account.firstName = firstName;
        account.lastName = lastName;
        account.subjectsTaught = subjectsTaught;
        tutorAccount.price = price;
        tutorAccount.jobTitle = jobTitle;
        tutorAccount.description = description;
    
        savedAccount = await account.save();
        await tutorAccount.save();
        accountUpdated = true;
    }
    catch(err) {
        error = err;
    }
   
   
    return {accountUpdated: accountUpdated, account: savedAccount, error: error};
}


async function updateProfilePicture(accountId, profilePictureUrl) {
    let accountUpdated = false;
    let savedAccount = undefined;

    if(profilePictureUrl && accountId) {
        try {
            let account = await Account.findById(accountId);
            account.profilePicture = profilePictureUrl;
            savedAccount = await account.save();
            savedAccount = await Account.findById(savedAccount.id).populate('accountType');
            accountUpdated = true;
        }
        catch(error) {
        }    
    }

    return {accountUpdated: accountUpdated, savedAccount: savedAccount}
}

module.exports = {login, createStudentAccount, createTutorAccount, getAllTutors, uploadImageToCloudinary, updateAccount,
    updateTutorAccount, updateProfilePicture}