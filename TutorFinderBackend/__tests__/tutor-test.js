const Tutor = require('../models/tutor');
const request = require('supertest');
const app = require('../app');


it('find all tutors, router.get("/api/tutor/all") returns tutors', async () => {
    const response = await request(app)
                            .get('/api/tutor/all');
    expect(response.status).toBe(200);
}) 