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
    check('subjects').exists().isArray()
]

const tutorRules = [
    check('email').exists().isEmail().normalizeEmail(),
    check('password').exists().isString(),
    check('firstName').exists().isString(),
    check('lastName').exists().isString(),
    check('subjects').exists().isArray(),
    check('price').exists().isNumeric()
]

module.exports = {accountRules, loginRules, studentRules, tutorRules}