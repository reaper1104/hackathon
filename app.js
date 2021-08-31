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
const e = require('express');
const { error } = require('console');

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

const router = express.Router();


app.get('/teacherclasses', (req, res, error) => {
    console.log(req.body);
    console.log(req.params);
    db.all('SELECT ID FROM TEACHER WHERE USERNAME = ?', [req.session.username], (error, results) => {
        console.log(results);
        if(error) {
            return res.send(error);
        }
        else {
            const tid = results[0].ID;
            console.log(tid);
            db.all('SELECT NAME, SUBJECT, CODE FROM CLASS WHERE TID = ?', [tid], (error, result) => {
                if(error) {
                    return res.send(error);
                }
                else {
                    return res.json(result);
                }
            });
        }
    });
});

app.get('/previousassignments', (req, res, error) => {
    db.all('SELECT A.NAME AS NAME, A.LINK AS LINK  FROM ASSIGNMENT A WHERE A.TID=?', [req.session.teacherid], (error, result) => {
        if(error) {
            console.log(error);
            return res.send(error);
        }
        else {
            console.log(result);
            res.json(result);
        }
    });
});

app.get('/studentclasses', (req, res, error) => {
    console.log(req.session.studentusername);
    db.all('SELECT ID FROM STUDENT WHERE USERNAME = ?', [req.session.studentusername], (error, results) => {
        console.log(results);
        if(error) {
            return res.send(error);
        }
        else {
            const studentid = results[0].ID;
            console.log(studentid);
            db.all('SELECT NAME, SUBJECT, CODE  FROM CLASS WHERE ID IN (SELECT CID FROM CLASS_STUDENT WHERE SID = ?);', [studentid], (error, result) => {
                if(error) {
                    console.log(error);
                    return res.send(error);
                }
                else {
                    console.log("studentresult: " + result);
                    return res.json(result);
                }
            });
        }
    });
});

app.get('/', (req, res) => {
    res.send("hello motherfucker!!!");
})



app.listen(process.env.PORT, ()=> console.log('App is running'));

module.exports = app;
