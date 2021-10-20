const {check} = require('express-validator');

const accountRules = [
    check('email').exists().isEmail().normalizeEmail(),
    check('password').exists().isString()
]

const loginRules = [
    check('email').exists().isEmail().normalizeEmail(),
    check('password').exists().isString()
]

const studentRules = [
    check('email').exists().isEmail().normalizeEmail(),
    check('password').exists().isString(),
    check('firstName').exists().isString(),
    check('lastName').exists().isString(),
]

const tutorRules = [
    check('email').exists().isEmail().normalizeEmail(),
    check('password').exists().isString(),
    check('firstName').exists().isString(),
    check('lastName').exists().isString(),
    check('jobTitle').exists().isString(),
    check('subjects').exists().isArray(),
    check('price').exists().isNumeric()
]

const updateTutorRules = [
    check('email').exists().isEmail().normalizeEmail(),
    check('firstName').exists().isString(),
    check('lastName').exists().isString(),
    check('price').exists().isNumeric(),
    check('jobTitle').exists().isString(),
    check('subjects').exists().isArray()
]

const updateStudentRules = [
    check('accountId').exists().isAlphanumeric(),
    check('email').exists().isEmail().normalizeEmail(),
    check('firstName').exists().isString(),
    check('lastName').exists().isString(),
]

const validateProfilePicture = (req, res, next) => {
    if(req.file) {
        if(req.file.profile_picture) {
           return next();
        }
    }
    
    return res.sendStatus(400);
    
}

module.exports = {accountRules, loginRules, studentRules, tutorRules, updateTutorRules, updateStudentRules, validateProfilePicture}