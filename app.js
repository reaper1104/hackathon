var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
const { response, request } = require('express');
const session = require('express-session');
const { constants } = require('buffer');


dotenv.config({path: './.env'});




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(express.urlencoded({ extended : false}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', require('./routes/auth.js'));
app.use('/users', usersRouter);



app.use(cors());
app.listen(process.env.PORT, ()=> console.log('App is running'));

module.exports = app;
