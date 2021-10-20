var express = require('express');
var router = express.Router();
require('dotenv').config()
const jwt = require('jsonwebtoken');


router.post('/validate-refresh-token', async (req, res, next) => {
    let header = req.headers.authorization;

    if(header) {
        let refreshToken = header.split(' ')[1];
        try {
            let verifiedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
            let accessToken = jwt.sign({email: verifiedToken.email, accountId: verifiedToken.accountId}, process.env.ACCESS_TOKEN_SECRET_KEY);
            res.cookie('access_token', accessToken, {httpOnly: true});
            return res.sendStatus(200);
        }
        catch(error) {
            return res.status(403).send({error: process.env.REFRESH_TOKEN_ERROR_CODE});
        }
    }
    else {
       return res.status(401).send({error: process.env.HEADER_ERROR_CODE});
    }
})

module.exports = router