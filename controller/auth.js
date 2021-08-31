var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const e = require('express');

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
        return res.send(`<a href='/teacher/register'>That user is already in use</a>`);
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
            return res.send(`<a href='/teacher/login'>User registered</a>`);
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
        return res.send(`<a href='/'>That user is already in use</a>`);
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
            return res.send(`<a href='/student/login'>STUDENT registered</a>`);
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
            if(error) {
              return res.send(error);
            }  
            if (results.length > 0) {
                  sessionData = req.session;

                  sessionData.loggedin = true;
                  sessionData.username = userName;
                  console.log(req.session);
                  console.log(req.session.username);
                  res.redirect('/teacher/homepage');
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
                  sessionData.studentusername = userName;
                  console.log(req.session);
                  console.log(req.session.studentusername);
                  res.redirect('/student/homepage');
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
  const {classname, subjectname} = req.body;
  console.log(classname);
  console.log(subjectname);

  db.all('SELECT NAME FROM CLASS WHERE NAME = ?', [classname], (error, result) => {
    if(result.length > 0) {
      res.send('<a href="/teacher/homepage">Class already created</a>');

    }
    else {
      console.log(req.session.username);
      username = req.session.username;
      db.all('SELECT ID FROM TEACHER WHERE USERNAME=?', [req.session.username], (error, results) => {
        if (error) {
          console.log(error);
        }
        else {
          console.log(results);
          console.log(results[0].ID);
          const id = results[0].ID;

          const str = "class_".concat(subjectname);
          const classcode = (Buffer.from(str, 'utf-8')).toString('base64');
          console.log(classcode);
          db.run('INSERT INTO CLASS(NAME, SUBJECT, CODE, TID) VALUES ((?), (?), (?), (?))', [classname, subjectname, classcode, id], (error) => {
            if(error) {
              console.log(error);
            }
            else {
              const output =  `<html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Subjext created</title>
                  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">
                  <script
                  src="https://code.jquery.com/jquery-3.1.1.min.js"
                  integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
                  crossorigin="anonymous"></script>
                <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
              </head>
              <body>
              <script>
              function myfunction() {
                var classcode = "`+classcode+`";
                document.getElementById('showcode').innerHTML = classcode;
                //classcode.select();
                //classcode.setSelectionRange(0, 99999); 
                //navigator.clipboard.writeText(classcode.value);
                //alert("Text Copied");
              }
              function copytext() {

              }
              </script>
                <nav class="navbar is-dark is-fixed-top">
                <div class="navbar-brand">
                  <a class="navbar-item" href="/">
                    Home
                  </a>
                  <div class="navbar-burger">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
          
                  <div class="navbar-end">
                    <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link is-arrowless">
                      Sign Up
                    </a>
                    <div class="navbar-dropdown">
                      <a href="/student/register" class="navbar-item">
                        Student
                      </a>
                      <hr class="navbar-divider">
                      <a href="/teacher/register" class="navbar-item">
                        Teacher
                      </a>
                    </div>
                  </div>
                  <div class="navbar-item has-dropdown is-hoverable">
                      <a class="navbar-link is-arrowless">
                        Sign In
                      </a>
                      <div class="navbar-dropdown">
                        <a href="/student/login" class="navbar-item">
                          Student
                        </a>
                        <hr class="navbar-divider">
                        <a href="/teacher/login" class="navbar-item">
                          Teacher
                        </a>
                      </div>
                    </div>
                </div>
              </nav> 
              <div class= "hero-body">
                <div class="container is-centered">
                  <button class="button is-medium is-fullwidth" onclick="myfunction()">Get Classcode</button>
                  <div id = "showcode"></div>
                </div>
                <button class="button is-large" onclick="location.href='/teacher/homepage'">Go To Homepage</button>
              </div>
              </body></html>`;

              return res.send(output);
            }
          });
        }
        
      });
    }
  });

}
