const jwt = require('jsonwebtoken');
require('dotenv').config()

/**
 * Generates refresh and access tokens and returns the generated tokens.
 * @param {String} email The user's email to be placed in the jwt's payload.
 * @returns object containing refresh and access token.
 */
function generateAccessAndRefreshTokens(email, accountId) {
    const refreshToken = jwt.sign({email: email, accountId: accountId}, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME});
    const accessToken = jwt.sign({email: email, accountId: accountId}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME});
    const tokens = {refreshToken: refreshToken, accessToken: accessToken};
    return tokens;
}


const validateAccessToken = (req, res, next) => {
    const authenticationHeader = req.headers.authorization;

    if (authenticationHeader) {
        const accessToken = authenticationHeader.split(' ')[1];
        try {
            jwt.verify(accessToken,  process.env.ACCESS_TOKEN_SECRET_KEY);
            next();
        }
        catch(error) {
            return res.status(403).send({error: process.env.ACCESS_TOKEN_ERROR_CODE});
        }

    } 
    else {
        res.status(401).send({error: process.env.HEADER_ERROR_CODE});
    }
}

const decodeAccessToken = (req, res, next) => {
    const authenticationHeader = req.headers.authorization;
    const accessToken = authenticationHeader.split(' ')[1];
    req.access_token = jwt.decode(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
    next();
}

module.exports = {generateAccessAndRefreshTokens, validateAccessToken, decodeAccessToken }