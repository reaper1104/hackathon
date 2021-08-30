var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const e = require('express');
const multer = require('multer');
const uuid = require('uuid');
const { status } = require('express/lib/response');
const { request } = require('http');


dotenv.config({path: './.env'})

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const{originalname} = file;
        cb(null, `${uuid}-${originalname}`);
    }
});

const upload = multer({storage: storage});

let db = new sqlite3.Database('./schema.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

exports.joinclass = (req, res) => {
    console.log(req.body);
    console.log(req.session.studentusername);
    const classcode = req.body.subcode;

    db.all('SELECT CID, SID FROM CLASS_STUDENT WHERE SID=(SELECT ID FROM STUDENT WHERE USERNAME=? AND CID=(SELECT ID FROM CLASS WHERE CODE=?));', [req.session.studentusername, classcode], function(error, results) {
        console.log(results);
        if(error) {
            console.log("error");
            console.log(error);
        }
        else {
            if(results.length > 0) {
                res.send(`<a href='/student/classes'>Already registered in Class</a>`);
            }
            else {
                console.log(results);
                db.each('SELECT ID FROM STUDENT WHERE USERNAME=?', [req.session.studentusername], (error, rows) => {
                    db.each('SELECT ID FROM CLASS WHERE CODE=?', [classcode], (err, row) => {
                        db.run('INSERT INTO CLASS_STUDENT(CID, SID) VALUES ((?), (?))', [rows.ID, row.ID],(error) => {
                            if(error) {
                                console.log(error);
                            }
                            else {
                                res.json(`<a href='/student/classes'>Student registered to the class</a>`);
                            }
                        });
                    });
                });
            }          
        }
    });
}

exports.assignmentpage = (req, res) => {
    sessionData = req.session;
    console.log("Request: " + req.body.id);
    console.log("username: " + req.session.username);
    db.all('SELECT ID FROM TEACHER WHERE USERNAME=?', [req.session.username], (err, result) => {
        if(err) {
            console.log("hello bro");
            return res.send(err);
        }
        else {
            console.log("result: " + result[0]);
            console.log("bye bro");
            const tid = result[0].ID;
            console.log("tid: " + tid);
            sessionData.teacherid = tid;
            db.all('SELECT ID, NAME FROM CLASS WHERE CODE = ?', [req.body.id], (error, resul) => {
                if(error) {
                    console.log("maa chuda bro");
                    return res.send(error);
                }
                else {
                    const cid = resul[0].ID;
                    const classname = resul[0].NAME;
                    console.log("cid: " + cid);
                    sessionData.classid = tid;
                    sessionData.classname = classname;

                    db.all('SELECT NAME, LINK FROM ASSIGNMENT WHERE TID=? AND CID=?', [tid, cid], (errors, results) => {
                        if(error) {
                            console.log("hohoho bro");
                            return res.send(errors);
                        }
                        else {
                            console.log(results);
                            console.log("Ganna gae bro");
                            //sessionData.assignmentlink = results[0].LINK;
                            return res.json(results);
                        }
                    });
                }    
            });
        }
    });
}


exports.uploadassignment = (req, res) => {
    console.log(req.body);
    console.log(req.file);
    console.log("cid : " + req.session.classid);
    console.log("tid:" + req.session.teacherid);

    db.all('SELECT ID FROM ASSIGNMENT WHERE LINK=?', [req.file.path], (error, results) => {
        if(error) {
            return res.send(error);
        }
        else {
            if(results.length >0) {
                return res.send(`<a href='/teacher/assignment'>File already uploaded</a>`);
            }
            else {
                console.log('hello');
                db.run('INSERT INTO ASSIGNMENT(NAME, CID, TID, LINK) VALUES ((?), (?), (?), (?))', [req.body.assignmentname, req.session.classid, req.session.teacherid, req.file.path], (errors) => {
                    if(errors) {
                        console.log('hello');
                        console.log(errors);
                        return res.send(errors);
                    }
                    else {
                        return res.send(`<a href='/teacher/assignment'>assignment uploaded</a>`);
                    }
                });
            }
        }
    });
}