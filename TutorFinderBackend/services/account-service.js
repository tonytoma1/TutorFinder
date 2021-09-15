const Account = require('../models/account');
const Student = require('../models/student');
const Tutor = require('../models/tutor');
const bcrypt = require('bcryptjs');

async function createStudentAccount(email, password, firstName, lastName, subjects) {
    const student = new Student({
        subjects: subjects
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

async function createTutorAccount(email, password, firstName, lastName, subjects, price) {
    const tutor = new Tutor({
        subjects: subjects,
        price, price
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

module.exports = {login, createStudentAccount, createTutorAccount, getAllTutors}