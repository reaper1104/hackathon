var express = require('express');
var router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/index.html'), {title: 'Index'});
});

router.get('/teacher/register', function(req, res) {
  console.log(req.body);
  res.sendFile(path.join(__dirname + '/../public/teacher/register.html'));
});

router.get('/student/register', function(req, res) {
  res.sendFile(path.join(__dirname + '/../public/student/register.html'));
});

router.get('/student/login', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/student/signin.html'), { title: 'Express' });
});

router.get('/teacher/login', function(req, res, next) {
  console.log("params" + req.params);
  console.log("body" + req.body);
  res.sendFile(path.join(__dirname + '/../public/teacher/signin.html'), { title: 'Express' });
});

router.get('/teacher/createclass', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/teacher/homepage.html'), { title: 'Express' });
});

router.get('/student/homepage', function(req, res, next) {
  console.log(req.body);

  res.sendFile(path.join(__dirname + '/../public/student/homepage.html'));
});

router.get('/teacher/assignment', function(req, res, next) {
  console.log("params" + req.params);
  console.log("body" + req.body);
  res.sendFile(path.join(__dirname + '/../public/teacher/assignment.html'));
});

router.get('/teacher/homepage', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/teacher/teacher.html'));
});

router.get('/student/joinclass', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/student/joinclass.html'));
});

router.get('/student/assignment', function(req, res, next) {
  console.log(req.body);
  res.sendFile(path.join(__dirname + '/../public/student/assignmentpage.html'));
});

router.get('/teacher/test', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/teacher/test.html'));
});

router.get('/student/test', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/student/test.html'));
});






module.exports = router;
