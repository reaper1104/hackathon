const express = require('express');
const authController = require('../controller/auth');
const authControllers = require('../controller/auths');
const path = require('path');
const { render } = require('../app.js');
const multer = require('multer');
const uuid = require('uuid');
const res = require('express/lib/response');
const { Router } = require('express');

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const{originalname} = file;
        cb(null, `${uuid()} - ${originalname}`);
    }
});



const storage2 = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/testUploads');
    },
    filename: (req, file, cb) => {
        const{originalname} = file;
        cb(null, `${uuid()} - ${originalname}`);
    }
});

const upload = multer({storage: storage});
const upload2 = multer({storage: storage2});
const upload3 = multer({storage: storage});
const router = express.Router();

router.post('/createclass', authController.createclass);

router.post('/register', authController.register);

router.post('/regstudent', authController.regstudent);

router.post('/login', authController.loginTeacher);

router.post('/loginstudent', authController.loginStudent);

router.post('/joinclass', authControllers.joinclass);

router.post('/uploadassignment', upload.single('assignmentupload'), authControllers.uploadassignment);

router.post('/uploadst', upload.single('studentassignments'), authControllers.uploadstudentassignment);

router.get('/assignmentpage', authControllers.assignmentpage);

router.post('/createtest', upload2.single('fileuploads'),authControllers.createtest);

router.get('/studentassignmentpage', authControllers.studentassignmentpage);

router.get('/testpage', authControllers.loadtestpage);

router.get('/studenttestpage', authControllers.studentTestPage);

module.exports = router;