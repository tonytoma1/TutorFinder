const Tutor = require('../models/tutor');
const Account = require('../models/account');
const request = require('supertest');
const app = require('../app');

beforeAll(async () => {
    await Account.deleteMany({});
    await Tutor.deleteMany({});
})

it('given tutor information, router.post("/register-tutor") should return status 200', async () => {
    const subjects = ['math', 'science'];
    const response = await request(app)
                           .post('/api/account/register-tutor')
                           .send({
                                email: 'registertutor1@example.com',
                                password: 'password',
                                firstName: 'student',
                                lastName: 'test',
                                subjects: subjects,
                                price: 20
                        });
    expect(response.status).toBe(200);
})


it('given tutor information, router.post("/register-tutor") should return status 200', async () => {
    const subjects = ['math', 'science'];
    const response = await request(app)
                           .post('/api/account/register-tutor')
                           .send({
                                email: 'registertutor2@example.com',
                                password: 'password',
                                firstName: 'student',
                                lastName: 'test',
                                subjects: subjects,
                                price: 20
                        });
    expect(response.status).toBe(200);
})


it('given tutor information, router.post("/register-tutor") should return status 200', async () => {
    const subjects = ['math', 'science'];
    const response = await request(app)
                           .post('/api/account/register-tutor')
                           .send({
                                email: 'registertutor3@example.com',
                                password: 'password',
                                firstName: 'student',
                                lastName: 'test',
                                subjects: subjects,
                                price: 20
                        });
    expect(response.status).toBe(200);
})