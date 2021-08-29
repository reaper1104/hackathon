var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sqlite3 = require('sqlite3').verbose();
var dotenv = require('dotenv');
const { response, request } = require('express');
const session = require('express-session');
const { constants } = require('buffer');


dotenv.config({path: './.env'});

let db = new sqlite3.Database('./schema.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the chinook database.');
});



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

app.get('/teacherclasses', (req, res, error) => {
    db.all('SELECT ID FROM TEACHER WHERE USERNAME = ?', [req.session.username], (error, results) => {
        if(error) {
            res.send(error);
        }
        else {
            const tid = results[0].ID;
            db.all('SELECT NAME, SUBJECT, CODE FROM CLASS WHERE TID = ?', [tid], (errpr, result) => {
                res.send(result);
            });
        }
    });
});




app.listen(process.env.PORT, ()=> console.log('App is running'));

module.exports = app;
