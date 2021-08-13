var express = require('express');
var router = express.Router();
const {loginRules} = require('../middleware/account-middleware');
const validate = require('../middleware/validate');
const {login} = require('../services/account-service');
const jwt = require('jsonwebtoken');


/* Login to an account, and send back refresh and access tokens */
router.post('/login', loginRules, validate, async (req, res, next) =>  {
  try {
    const account = login(req.body.email, req.body.password);
    const refreshToken = jwt.sign({email: account.email}, process.env.REFRESH_TOKEN_SECRET_KEY, 
                                  {expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME});
    const accessToken = jwt.sign({email: account.email}, process.env.ACCESS_TOKEN_SECRET_KEY,
                                {expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME});
    res.cookie("refresh_token", refreshToken, {httpOnly: true});
    res.cookie("access_token", accessToken, {httpOnly: true});
    return res.status(200).json({code: 'logged in'});
  }
  catch(error) {
    return res.status(400).json({code: 'Unable to login'});
  }

});

module.exports = router;