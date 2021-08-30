const express = require('express');
const authController = require('../controller/auth');
const authControllers = require('../controller/auths');
const path = require('path');
const { render } = require('../app.js');
const multer = require('multer');
const uuid = require('uuid');
const res = require('express/lib/response');

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const{originalname} = file;
        cb(null, `${uuid()} - ${originalname}`);
    }
});

const upload = multer({storage: storage});


const router = express.Router();

router.post('/createclass', authController.createclass);

router.post('/register', authController.register);

router.post('/regstudent', authController.regstudent);

router.post('/login', authController.loginTeacher);

router.post('/loginstudent', authController.loginStudent);

router.post('/joinclass', authControllers.joinclass);

router.post('/uploadassignment', upload.single('assignmentupload'), authControllers.uploadassignment);

router.post('/assignmentpage', authControllers.assignmentpage);

module.exports = router;