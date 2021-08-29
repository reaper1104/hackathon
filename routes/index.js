var express = require('express');
var router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/index.html'), {title: 'Index'});
});

router.get('/teacher/register', function(req, res) {
  res.sendFile(path.join(__dirname + '/../public/teacher/register.html'));
});

router.get('/student/register', function(req, res) {
  res.sendFile(path.join(__dirname + '/../public/student/register.html'));
});

router.get('/student/login', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/student/signin.html'), { title: 'Express' });
});

router.get('/teacher/login', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/teacher/signin.html'), { title: 'Express' });
});

router.get('/homepage', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/homepage.html'), { title: 'Express' });
});

router.get('/student/classes', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/student/joinclass.html'));
});



module.exports = router;
