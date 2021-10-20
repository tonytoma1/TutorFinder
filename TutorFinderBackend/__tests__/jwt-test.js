const {generateAccessAndRefreshTokens} = require('../services/jwt-service');
const request = require('supertest');
const express = require('express');
const app = require('../app');
const jwt = require('jsonwebtoken');
require('dotenv').config()
var cookieParser = require('cookie-parser');
var cookie = require('cookie');


it('given an email, generateAccessAndRefreshTokens() returns object with tokens', () => {
    const response = generateAccessAndRefreshTokens('example@example.com');
    expect(response).toBeTruthy();
    expect(response.accessToken).toBeTruthy();
    expect(response.refreshToken).toBeTruthy();
})

it('given access token, router.post("api/account/jwt-access-token") will return 200 access tokens is valid', async () => {
    const jwt = generateAccessAndRefreshTokens("lol@example.com");
    let response = await request(app)
                        .post('/api/account/test-jwt')
                        .set("authorization", 'Bearer ' + jwt.accessToken);
    expect(response.status).toBe(200);
                                        
})

it('given invalid access token, router.post("api/account/jwt-access-token") will return 403 error', async () => {
    let response = await request(app)
    .post('/api/account/test-jwt')
    .set("authorization", 'Bearer lol');

    expect(response.status).toBe(403);
    
})

it('given no access token, router.post("api/account/jwt-access-token") will return 401 error', async () => {
    let response = await request(app)
    .post('/api/account/test-jwt')

    expect(response.status).toBe(401);
    
})

it('given a valid refresh token, router.post("api/jwt/validate-refresh-token") returns new access token', async () => {
    const refreshToken = jwt.sign({email: "test@example.com"}, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME});

    let response = await request(app)
                         .post('/api/jwt/validate-refresh-token')
                         .set('Authorization', 'Bearer ' + refreshToken)
 
    let token = cookie.parse(response.headers['set-cookie'][0])
    let verfiedToken = jwt.verify(token.access_token, process.env.ACCESS_TOKEN_SECRET_KEY);
    expect(verfiedToken).toBeTruthy()
    expect(response.headers['set-cookie'][0]).toBeTruthy();
    expect(response.status).toBe(200);
})

it('given a expired refresh token, router.post("api/jwt/validate-refresh-token") returns status 403', async () => {
    const refreshToken = jwt.sign({email: "test@example.com"}, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: '1ms'});

    let response = await request(app)
                         .post('/api/jwt/validate-refresh-token')
                         .set('Authorization', 'Bearer ' + refreshToken)

    expect(response.status).toBe(403);
})