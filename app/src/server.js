/* *
  title: server.js 

  date: 5/28/2019

  author:  javier olaya

  description: the Main server that handles the main processing for accessing and sending  the list of usernames 
         
 */
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const app = express();
app.use(express.static('static_files'));

//define all the variables
const IP = 'localhost';
const PORT = 3000;

const db = new sqlite3.Database("grailed-exercise.sqlite3");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(PORT, IP, () => {
  console.log(`server running at http://${IP}:${PORT}`);
});


// return the list of disallowed usernames
app.get('/disallowed_usernames', (req, res, next) => {

  db.all("Select * FROM 'disallowed_usernames'", (err, rows) => {
    res.setHeader("Content-type", "application/x-www-form-urlencoded");
    res.send({ "rows": rows });
  });

});


// function that will process the username
let queryProcess = function (req, res, next) {
  function extractNumberIndx(name) {
    for (ind = 0; ind < name.length; ind += 1) {
      // get a substring of that user name

      if (!isNaN(name[ind])) { return ind }
    }
    return 0;
  }

  function extractName(name, finalInd, counter) {
    let actualName;
    finalInd != 0 ? actualName = name.substring(0, finalInd) + counter : actualName = name + counter;
    return actualName;
  }
  const rows = res.rows;
  let actualName = ""
  let finalInd = 0;
  let finalResult = [];
  let counter = 1;
  let prevUser = null;
  // go through every row
  rows.map((currRec, index) => {
    if (index === 0) {
      prevUser = currRec;
      // get the index at which the number starts in the name, or return 0 if no number is in the name
      finalInd = extractNumberIndx(currRec.username);
      actualName = extractName(currRec.username, finalInd, counter);
      finalResult.push({ id: currRec.id, username: actualName })

      counter++;
    } else {
      if (prevUser.username === currRec.username) {
        finalInd = extractNumberIndx(currRec.username);
        actualName = extractName(currRec.username, finalInd, counter);
        finalResult.push({ id: currRec.id, username: actualName })
        counter++;
        prevUser = currRec;
      } else {
        counter = 1;
        finalInd = extractNumberIndx(currRec.username);
        actualName = extractName(currRec.username, finalInd, counter);
        finalResult.push({ id: currRec.id, username: actualName })
        counter++;
        prevUser = currRec;
      }

    }
  });
  res.send({ "rows": finalResult });

}

// fuction that will get the all the username duplicates and return new usernames with an indexed number as part of the new username
app.get('/collisions', (req, res, next) => {

  db.all("SELECT u1.*, u2.cnt AS Duplicate FROM users u1 INNER JOIN ( SELECT username, COUNT(*) AS cnt FROM users GROUP BY username) u2   WHERE u2.cnt >= 2  AND u1.username = u2.username"
    , (err, rows) => {
      res.setHeader("Content-type", "application/x-www-form-urlencoded");

      if (rows.length < 1) { res.send({ "rows": [] }); }
      else {
        // send the an object as row and the stack as the value
        res.rows = rows;
        next();
      }
    });

}, queryProcess);


// function that will return a list of disallowed usernames with an appended index number on the username
app.get('/resolveDisallowedNames', (req, res, next) => {
  db.all("SELECT * FROM disallowed_usernames u1 INNER JOIN users u2  ON u1.invalid_username = u2.username "
    , (err, rows) => {
      res.setHeader("Content-type", "application/x-www-form-urlencoded");
      if (rows.length < 1) { res.send({ "rows": [] }); }
      else {
        // send the an object as row and the stack as the value
        res.rows = rows;
        next();
      }
    });

}, queryProcess);


// in case you would wanna run a dry function
if (process.argv.length > 1) {

  if (process.argv[2] == "run2") {
    function extractNumberIndx(name) {
      for (ind = 0; ind < name.length; ind += 1) {
        // get a substring of that user name

        if (!isNaN(name[ind])) { return ind }
      }
      return 0;
    }

    function extractName(name, finalInd, counter) {
      let actualName;
      finalInd != 0 ? actualName = name.substring(0, finalInd) + counter : actualName = name + counter;
      return actualName;
    }
    db.all("SELECT * FROM disallowed_usernames u1 INNER JOIN users u2  ON u1.invalid_username = u2.username "
      , (err, rows) => {

        if (rows.length < 1) { res.send({ "rows": [] }); }
        else {
          // send the an object as row and the stack as the value
          let actualName = ""
          let finalInd = 0;
          let finalResult = [];
          let counter = 1;
          let prevUser = null;
          // go through every row
          rows.map((currRec, index) => {
            if (index === 0) {
              prevUser = currRec;
              // get the index at which the number starts in the name, or return 0 if no number is in the name
              finalInd = extractNumberIndx(currRec.username);
              actualName = extractName(currRec.username, finalInd, counter);
              finalResult.push({ id: currRec.id, username: actualName })

              counter++;
            } else {
              if (prevUser.username === currRec.username) {
                finalInd = extractNumberIndx(currRec.username);
                actualName = extractName(currRec.username, finalInd, counter);
                finalResult.push({ id: currRec.id, username: actualName })
                counter++;
                prevUser = currRec;
              } else {
                counter = 1;
                finalInd = extractNumberIndx(currRec.username);
                actualName = extractName(currRec.username, finalInd, counter);
                finalResult.push({ id: currRec.id, username: actualName })
                counter++;
                prevUser = currRec;
              }

            }
          });
          console.log(finalResult);
        }
      });
  }

  if (process.argv[2] == "run1") {
    function extractNumberIndx(name) {
      for (ind = 0; ind < name.length; ind += 1) {
        // get a substring of that user name

        if (!isNaN(name[ind])) { return ind }
      }
      return 0;
    }

    function extractName(name, finalInd, counter) {
      let actualName;
      finalInd != 0 ? actualName = name.substring(0, finalInd) + counter : actualName = name + counter;
      return actualName;
    }
    db.all("SELECT u1.*, u2.cnt AS Duplicate FROM users u1 INNER JOIN ( SELECT username, COUNT(*) AS cnt FROM users GROUP BY username) u2   WHERE u2.cnt >= 2  AND u1.username = u2.username"
      , (err, rows) => {

        if (rows.length < 1) { res.send({ "rows": [] }); }
        else {
          // send the an object as row and the stack as the value
          let actualName = ""
          let finalInd = 0;
          let finalResult = [];
          let counter = 1;
          let prevUser = null;
          // go through every row
          rows.map((currRec, index) => {
            if (index === 0) {
              prevUser = currRec;
              // get the index at which the number starts in the name, or return 0 if no number is in the name
              finalInd = extractNumberIndx(currRec.username);
              actualName = extractName(currRec.username, finalInd, counter);
              finalResult.push({ id: currRec.id, username: actualName })

              counter++;
            } else {
              if (prevUser.username === currRec.username) {
                finalInd = extractNumberIndx(currRec.username);
                actualName = extractName(currRec.username, finalInd, counter);
                finalResult.push({ id: currRec.id, username: actualName })
                counter++;
                prevUser = currRec;
              } else {
                counter = 1;
                finalInd = extractNumberIndx(currRec.username);
                actualName = extractName(currRec.username, finalInd, counter);
                finalResult.push({ id: currRec.id, username: actualName })
                counter++;
                prevUser = currRec;
              }

            }
          });
          console.log(finalResult);
        }
      });
  }
}




