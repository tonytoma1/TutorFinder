const {generateAccessAndRefreshTokens} = require('../services/jwt-service');

it('given an email, generateAccessAndRefreshTokens() returns object with tokens', () => {
    const response = generateAccessAndRefreshTokens('example@example.com');
    expect(response).toBeTruthy();
    expect(response.accessToken).toBeTruthy();
    expect(response.refreshToken).toBeTruthy();
})