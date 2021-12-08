var express = require('express');
var router = express.Router();
const {loginRules, tutorRules, studentRules, updateTutorRules, updateStudentRules,
  validateProfilePicture, requireParams} = require('../middleware/account-middleware');
const validate = require('../middleware/validate');
const {login, createStudentAccount, createTutorAccount, updateTutorAccount, 
  updateAccount, uploadImageToCloudinary, updateProfilePicture, 
  updateAccountPassword} = require('../services/account-service');
const {sendUpdatePasswordRequest, comparePasswordPins} = require('../services/email-service');
const jwt = require('jsonwebtoken');
const {generateAccessAndRefreshTokens, validateAccessToken, decodeAccessToken} = require('../services/jwt-service');
const Account = require('../models/account');
const multer  = require('multer')
const fs = require('fs');

const TEN_MEGABYTES = 10485760;

const storage = multer.diskStorage({
  dest: 'uploads/', 
  limits: {
    fileSize: TEN_MEGABYTES
  }, 
  filename(req, file, callback) { 
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
  }});

const upload = multer({storage});


const DUPLICATE_EMAIL_ERROR_CODE = 11000;

/* Login to an account, and send back refresh and access tokens */
router.post('/login', loginRules, validate, async (req, res, next) =>  {
  try {
    let account = await login(req.body.email, req.body.password);
    const refreshToken = jwt.sign({email: account.email, accountId: account.id}, process.env.REFRESH_TOKEN_SECRET_KEY,
                                  {expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME});
    const accessToken = jwt.sign({email: account.email,  accountId: account.id}, process.env.ACCESS_TOKEN_SECRET_KEY,
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
    const tokens = generateAccessAndRefreshTokens(studentAccount.email, studentAccount.id);
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
    const tokens = generateAccessAndRefreshTokens(tutorAccount.email, tutorAccount.id);
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
    let response = await updateTutorAccount(req.body.accountId, req.body.firstName, req.body.lastName,
                    req.body.email, req.body.subjects, req.body.price, req.body.jobTitle, 
                    req.body.description);

    if(response.accountUpdated) {
      response.account = await Account.findById(response.account.id).populate('accountType' , '-password');

      return res.status(200).json({response: 'Account updated', savedAccount: response.account});

    }
    else {
      let error = "";
      if(response.error.code == DUPLICATE_EMAIL_ERROR_CODE ) {
        error = "Email already in use";
      }
      
      return res.status(400).json({response: 'Update Unsuccessful', error: error});

    }
})

router.post('/update-student-account', updateStudentRules, validate, async (req, res, next) => {
    let response = await updateAccount(req.body.accountId, req.body.firstName, req.body.lastName,
                                       req.body.email);
    if(response.accountUpdated) {
      let account = await Account.findById(response.account._id).populate('accountType' , '-password');
      return res.status(200).json({account: account})
    }
    else {
      let error = "";
      if(response.error.code == DUPLICATE_EMAIL_ERROR_CODE ) {
        error = "Email already in use";
      }

      return res.status(400).json({account: undefined, error: error});
    }
})

// Updates a user's profile picture.
router.post('/upload-profile-picture', validateAccessToken, upload.single('profile_picture'), validateProfilePicture,
  decodeAccessToken, async (req, res, next) => {      
      try {
          // Upload image to the cloud database
          let uploadedImage = await uploadImageToCloudinary(req.file.path);
          if(!uploadedImage) {
            throw 'invalid_image'
          }
          
          // Update the user's profile picture
          let result = await updateProfilePicture(req.access_token.accountId, uploadedImage);

          if(!result.accountUpdated) {
            throw 'account_not_updated'
          }

          // Delete the image from disk storage since the image is already uploaded to the database
          fs.unlink(req.file.path, (error) => {

          })
          return res.status(200).json(result);       
      }
      catch(error) {
        return res.status(400).send({error: error});
      }
  })

router.post('/password-pin/:email', requireParams(['email']), async (req, res, next) => {
    let result = await sendUpdatePasswordRequest(req.params.email);

    if(result.messageSent) {
      return res.status(200).json({message: 'Email Sent'});
    }
    else {
      return res.status(400).json({error: result.error})
    }
 
})

router.post("/password-pin/:email/:pin", requireParams(['email', 'pin']), async (req, res, next) => {
    // check if the passwords pin match
    const pinsMatch = await comparePasswordPins(req.params.email, req.params.pin);
    // if they match then allow user to update their password
    if(pinsMatch) {
      return res.status(200).json({message: "pins_match"});
    }
    else {
      return res.status(400).json({message: "incorrect pin"})
    }
  })

router.put("/password/:email/:passwordPin/:newPassword", requireParams(['email', 'passwordPin', 'newPassword']), async (req, res, next) => {
    const accountUpdated = await updateAccountPassword(req.params.email, req.params.passwordPin, req.params.newPassword);
    if(accountUpdated)
      return res.status(200).json({message: "Account Updated"});
    else 
      return res.status(400).json({message: "Updated Failed"});
})

router.post('/test-jwt', validateAccessToken, (req, res, next) => {
  return res.send(200);
})

module.exports = router;