const jwt = require('jsonwebtoken');
require('dotenv').config()

/**
 * Generates refresh and access tokens and returns the generated tokens.
 * @param {String} email The user's email to be placed in the jwt's payload.
 * @returns object containing refresh and access token.
 */
function generateAccessAndRefreshTokens(email) {
    const refreshToken = jwt.sign({email: email}, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME});
    const accessToken = jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME});
    const tokens = {refreshToken: refreshToken, accessToken: accessToken};
    return tokens;
}

module.exports = {generateAccessAndRefreshTokens}