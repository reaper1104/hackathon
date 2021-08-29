var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');

dotenv.config({path: './.env'})

let db = new sqlite3.Database('./schema.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');

});

exports.register = (req, res) => {
  console.log(req.body);

  const userName = req.body.username;
  const name = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword   = req.body.confirmPassword;

  db.all(`SELECT USERNAME FROM TEACHER WHERE USERNAME = ?`, [userName], (error, results) => {

    if(error) {
        console.log(error); 
    }

    console.log(results);

    if ( results.length > 0 ) {
        return res.send('That user is already in use');
        //res.redirect('/index.html');
    }

    else if(password !== confirmPassword) {
        return res.send('Passwords donot match');
        //res.redirect('/index.html');
    }

    //let hashPassword = bcrypt.hash(password, 8);
    //console.log(hashPassword);

    db.run('INSERT INTO TEACHER(NAME, USERNAME, PASSWORD, EMAIL) VALUES ((?), (?), (?), (?))', [ name, userName, password, email] , (error) => {
        if(error) {
            console.log(error);
        }

        else {
            console.log(results);
            return res.send('User registered');
        }
    });
    console.log('bye');

  });
}

exports.regstudent = (req, res) => {
  console.log(req.body);

  const userName = req.body.username;
  const name = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword   = req.body.confirmPassword;

  db.all(`SELECT USERNAME FROM STUDENT WHERE USERNAME = ?`, [userName], (error, results) => {

    if(error) {
        console.log(error); 
    }

    console.log(results);

    if ( results.length > 0 ) {
        return res.send('That user is already in use');
        //res.redirect('/index.html');
    }

    else if(password !== confirmPassword) {
        return res.send('Passwords donot match');
        //res.redirect('/index.html');
    }

    //let hashPassword = bcrypt.hash(password, 8);
    //console.log(hashPassword);

    db.run('INSERT INTO STUDENT(NAME, USERNAME, PASSWORD, EMAIL) VALUES ((?), (?), (?), (?))', [ name, userName, password, email], () => {
        if(error) {
            console.log(error);
        }

        else {
            console.log(results);
            return res.send('STUDENT registered');
        }
    });
    console.log('bye');

  });
}

exports.loginTeacher = async (req, res) => {
  console.log(req.body);
  console.log(req.session);
  try {
      const {userName, password} = req.body;
      
      if(userName && password) {
          db.all('SELECT * FROM TEACHER WHERE USERNAME = ? AND PASSWORD = ?', [userName, password], function(error, results, fields) {
              if (results.length > 0) {
                  sessionData = req.session;

                  sessionData.loggedin = true;
                  sessionData.username = userName;
                  console.log(req.session);
                  console.log(req.session.username);
                  res.redirect('/homepage');
              } else {
                  res.send('Incorrect Username and/or Password!');
              }			
              res.end();
          });
      } else {
          res.send('Please enter Username and Password!');
          res.end();
      }
  
  
  }
  catch(error) {
      console.log(error);
  }
}

exports.loginStudent = (req, res) => {
  console.log(req.body);
  try {
      const {userName, password} = req.body;
      
      if(userName && password) {
          db.all('SELECT * FROM STUDENT WHERE USERNAME = ? AND PASSWORD = ?', [userName, password], function(error, results, fields) {
              if (results.length > 0) {
                  sessionData = req.session;
                
                  sessionData.loggedinstudent = true;
                  sessionData.username = studentuserName;
                  console.log(req.session);
                  console.log(req.session.studentusername);
                  res.redirect('/homepage');
              } else {
                  res.send('Incorrect Username and/or Password!');
              }			
              res.end();
          });
      } else {
          res.send('Please enter Username and Password!');
          res.end();
      }
  
  
  }
  catch(error) {
      console.log(error);
  }
}




exports.createclass = (req, res) => {
  
  console.log(req.body);
  

}
