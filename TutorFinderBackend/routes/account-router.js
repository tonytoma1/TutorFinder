var express = require('express');
var router = express.Router();
const {loginRules, tutorRules, studentRules, updateTutorRules} = require('../middleware/account-middleware');
const validate = require('../middleware/validate');
const {login, createStudentAccount, createTutorAccount, updateTutorAccount} = require('../services/account-service');
const jwt = require('jsonwebtoken');
const {generateAccessAndRefreshTokens} = require('../services/jwt-service');

const DUPLICATE_EMAIL_ERROR_CODE = 11000;

/* Login to an account, and send back refresh and access tokens */
router.post('/login', loginRules, validate, async (req, res, next) =>  {
  try {
    let account = await login(req.body.email, req.body.password);
    const refreshToken = jwt.sign({email: account.email}, process.env.REFRESH_TOKEN_SECRET_KEY,
                                  {expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME});
    const accessToken = jwt.sign({email: account.email}, process.env.ACCESS_TOKEN_SECRET_KEY,
                                {expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME});
    res.cookie("refresh_token", refreshToken, {httpOnly: true});
    res.cookie("access_token", accessToken, {httpOnly: true});
    account.password = undefined;
    return res.status(200).json({code: 'logged in', email: account.email, account: account});
  }
  catch(error) {
    return res.status(400).json({code: 'Unable to login'});
  }

});

// Create a student account
router.post('/register-student', studentRules, validate, async (req, res, next) => {
  try {
    const studentAccount = await createStudentAccount(req.body.email, req.body.password, req.body.firstName, req.body.lastName);
    const tokens = generateAccessAndRefreshTokens(studentAccount.email);
    res.cookie("refresh_token", tokens.refreshToken, {httpOnly: true});
    res.cookie("access_token", tokens.accessToken, {httpOnly: true});
    return res.status(200).json({response: 'account created'});
  }
  catch(error) {
    let msg = '';
    if(error.code == DUPLICATE_EMAIL_ERROR_CODE) {
      msg = 'That email is already registered into the system';
    }

    return res.status(400).json({response: 'Unable to create account', message: msg});

  }
});

// create a tutor account
router.post('/register-tutor', tutorRules, validate, async (req, res, next) => {
  try {
    const tutorAccount = await createTutorAccount(req.body.email, req.body.password, req.body.firstName,
                                                  req.body.lastName, req.body.subjects, req.body.price,
                                                  req.body.jobTitle);
    const tokens = generateAccessAndRefreshTokens(tutorAccount.email);
    res.cookie("refresh_token", tokens.refreshToken, {httpOnly: true});
    res.cookie("access_token", tokens.accessToken, {httpOnly: true});
    return res.status(200).json({response: 'account created'});
   }
  catch(error) {
    if (error.code == DUPLICATE_EMAIL_ERROR_CODE) {
      return res.status(400).json({response: 'Email already registered. Please use a different email.'})
    }
    else {
      return res.status(400).json({response: 'Unable to create account'});
    }
  }
})
 
// update a tutor's account
router.post('/update-tutor-account', updateTutorRules, validate, async (req, res, next) => {
  try {
    let response = await updateTutorAccount();
  }
  catch(error) {

  }
})


module.exports = router;