const express = require('express');
const authController = require('../controller/auth');
const path = require('path');
const { render } = require('../app.js');

const router = express.Router();

router.post('/createclass', authController.createclass);

router.post('/register', authController.register);

router.post('/regstudent', authController.regstudent);

router.post('/login', authController.loginTeacher);

router.post('/loginstudent', authController.loginStudent);

module.exports = router;