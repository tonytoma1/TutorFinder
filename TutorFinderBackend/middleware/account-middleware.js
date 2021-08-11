const {check} = require('express-validator');

const createAccountRules = [
    check('email').exists().isEmail().normalizeEmail(),
    check('password').exists().isString()
]

module.exports = {createAccount}