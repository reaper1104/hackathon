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
const url = require('url');


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
                res.send(`<a href='/student/homepage'>Already registered in Class</a>`);
            }
            else {
                console.log(results);
                db.all('SELECT ID FROM STUDENT WHERE USERNAME=?', [req.session.studentusername], (error, result) => {
                    db.all('SELECT ID FROM CLASS WHERE CODE=?', [classcode], (err, resul) => {
                        db.run('INSERT INTO CLASS_STUDENT(CID, SID) VALUES ((?), (?))', [resul[0].ID, result[0].ID],(error) => {
                            if(error) {
                                console.log(error);
                            }
                            else {
                                res.send(`<a href='/student/homepage'>Student registered to the class</a>`);
                            }
                        });
                    });
                });
            }          
        }
    });
}

exports.assignmentpage = (req, res) => {
    const id = url.parse(req.url, true).query.id;
    console.log(id);
    db.all('SELECT TID, ID FROM CLASS WHERE CODE = ?', [id], (error,result) => {
        if(error) {
            return res.send(error);
        }
        else {
            db.all('SELECT NAME, LINK FROM ASSIGNMENT WHERE CID=?', [result[0].ID], (errors, results) => {
                if(errors) {
                    return res.send(errors);
                }
                else {
                    console.log("Done and dusted");
                    console.log("results: " + results);
                    return res.send(results);
                }
            });
        }
    });
}


exports.uploadassignment = (req, res) => {
    console.log("body: " + req.body.code);
    console.log(req.file);

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
                db.all('SELECT ID FROM CLASS WHERE CODE=?', [req.body.code], (err, resul) => {
                    if(err) {
                        return res.send(err);
                    }
                    else {
                        console.log(resul[0]);
                        db.all('SELECT ID FROM TEACHER WHERE USERNAME=? ', [req.session.username], (errors, result) => {
                            if(errors) {
                                return res.send(errors);
                            }
                            else {
                                db.run('INSERT INTO ASSIGNMENT(NAME, CID, TID, LINK) VALUES ((?), (?), (?), (?))', [req.body.assignmentname, resul[0].ID, result[0].ID, req.file.path], (errors) => {
                                    if(errors) {
                                        console.log('hello');
                                        console.log(errors);
                                        return res.send(errors);
                                    }
                                    else {
                                        console.log("REsult done and dusted");
                                        res.send(`<a href='/teacher/assignment'>Assignment uploaded</a>`);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
}

exports.studentassignmentpage = (req, res, next) => {
    console.log(url.parse(req.url, true).query);
//    console.log("body: " +req.body.id);
//    console.log("params: " + req.params.id);
    const id = url.parse(req.url, true).query.id;
    db.all('SELECT TID, ID FROM CLASS WHERE CODE = ?', [id], (error,result) => {
        if(error) {
            return res.send(error);
        }
        else {
            db.all('SELECT NAME, LINK FROM ASSIGNMENT WHERE CID=?', [result[0].ID], (errors, results) => {
                if(errors) {
                    return res.send(errors);
                }
                else {
                    console.log("Done and dusted");
                    console.log("results: " + results);
                    return res.send(results);
                }
            });
        }
    });
}

//exports.loadstudentassignmentpage = (req, res) => {
//    console.log(req.body);
//    console.log('hello bye bye');
//    return res.send(req.body);
//}


exports.createtest = (req, res) => {
    console.log(req.body);
    db.all('SELECT LINK FROM TEST WHERE LINK=?', req.body.googleforms, (error, result) => {
        if(error) {
            console.log(error);
            return res.send(error);
        }
        else {
            if(result.length>0) {
                return res.send(`<a href='/teacher/test'>Test already exists</a>`);
            }
            else {
                db.all('SELECT ID, TID FROM CLASS WHERE CODE=?', [req.body.code], (err, resul) => {
                    if(err) {
                        console.log(err);
                        return res.send(err);
                    }       
                    else {
                        db.get('INSERT INTO TEST(NAME, CID, LINK, TEST_DATE) VALUES ((?), (?), (?), (?))', [req.body.testName, resul[0].ID, req.body.googleforms, req.body.testDate], (errors) => {
                            if(errors) {
                                console.log(errors);
                            }
                            else {
                                return res.send(`<a href='/teacher/test'>Test Uploaded</a>`);
                            }
                        });
                    }
                });
            }
        }
    });
}

exports.loadtestpage = (req, res) => {
    console.log(url.parse(req.url, true).query);
    const id = url.parse(req.url, true).query.id;

    db.all('SELECT ID FROM CLASS WHERE CODE=?', [id], (error, results) => {
        if(error) {
            console.log("error1: " + error);
            return res.send(error);
        }
        else {
            db.all('SELECT NAME, LINK, TEST_DATE FROM TEST WHERE CID= ?', [results[0].ID], (err, result) => {
                if(err) {
                    console.log("error2: " + err);
                    return res.send(err);
                }
                else {
                    console.log(result);
                    return res.json(result);
                }
            });
        }
    });
}

exports.studentTestPage = (req, res) => {
    console.log(url.parse(req.url, true).query);
    const id = url.parse(req.url, true).query.id;

    db.all('SELECT ID FROM CLASS WHERE CODE=?', [id], (error, results) => {
        if(error) {
            console.log("error1: " + error);
            return res.send(error);
        }
        else {
            db.all('SELECT NAME, LINK, TEST_DATE FROM TEST WHERE CID= ?', [results[0].ID], (err, result) => {
                if(err) {
                    console.log("error2: " + err);
                    return res.send(err);
                }
                else {
                    console.log(result);
                    return res.json(result);
                }
            });
        }
    });
}