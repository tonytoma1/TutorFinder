var express = require('express');
var router = express.Router();
const {getAllTutors} = require('../services/account-service');
const mongoose = require('mongoose');

router.get('/all', async (req, res, next) => {
    const tutorsFound = await getAllTutors();
    return res.status(200).json({tutors: tutorsFound});
})


module.exports = router;