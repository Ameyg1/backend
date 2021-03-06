const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
//const path=require('path');
require("dotenv").config();
// parse application/json
app.use(bodyParser.json());
app.use(cors());

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

/** EDITABLE: To change the frequency of ads on Attendees page, change the value for the below variable.
 * For example, if the value is 2, it means an ad will be displayed after every 2 cell of attendee
 * business cards on Attendees List
 **/
const adFrequency = 2000000000000;

//create database connection
const conn = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database
});

//connect to database
conn.connect(err => {
  if (err) throw err;
  else {
    console.log("Mysql Connected...");
  }
});

// event validation
app.post("/api/event/validate", (req, res) => {
  let data = { EVENT_ID: req.body.EVENT_ID };
  let sql = "SELECT * FROM event WHERE EVENT_ID=" + req.body.EVENT_ID;
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});
//show all attendees for particular event
app.get("/api/attendees/:id", (req, res) => {
  const queryPlan = "SELECT PLAN FROM event WHERE EVENT_ID=" + req.params.id;
  let eventPlan = "";
  conn.query(queryPlan, (err, results) => {
    if (err) throw err;
    eventPlan = results;
  });
  const queryAttendeesList =
    "SELECT * FROM attendees WHERE EVENT_ID=" + req.params.id;
  conn.query(queryAttendeesList, (err, results) => {
    if (err) throw err;
    if (eventPlan[0].PLAN === "Freemium") {
      const adCell = {
        ID: 0,
        NAME: " ",
        TITLE: " ",
        COMPANY: " ",
        BIO: " ",
        EMAIL: " ",
        FACEBOOK: " ",
        LINKEDIN: " ",
        TWITTER: " ",
        EVENT_ID: req.params.id
      };
      const noOfAttendeesBeforeInjectingEachAd = adFrequency;
      let numberOfAdsAlreadyDisplayed = 0;
      let totalAttendeesAboveThisAd = 0;
      const totalAds =
        Math.ceil(results.length / noOfAttendeesBeforeInjectingEachAd) - 1;
      for (let index = 0; index < totalAds; index++) {
        totalAttendeesAboveThisAd += noOfAttendeesBeforeInjectingEachAd;
        totalCellsBeforeThisAd =
          totalAttendeesAboveThisAd + numberOfAdsAlreadyDisplayed;
        results.splice(totalCellsBeforeThisAd, 0, adCell);
        numberOfAdsAlreadyDisplayed += 1;
      }
    }
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//show particular event details
app.get("/api/event/:id", (req, res) => {
  let sql = "SELECT * FROM event WHERE EVENT_ID=" + req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//show single product
app.get("/api/attendees/:id", (req, res) => {
  let sql = "SELECT * FROM attendees WHERE ID=" + req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//add new event
app.post("/api/event", (req, res) => {
  let data = {
    EVENT_NAME: req.body.EVENT_NAME,
    ORG_EMAIL: req.body.ORG_EMAIL,
    ORGANISER: req.body.ORGANISER,
    VENUE: req.body.VENUE,
    PURPOSE: req.body.PURPOSE,
    PLAN: "Freemium"
  };
  let sql = "INSERT INTO event SET ? ";
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});
//add new product
app.post("/api/attendees/:id", (req, res) => {
  let data = {
    NAME: req.body.NAME,
    TITLE: req.body.TITLE,
    COMPANY: req.body.COMPANY,
    BIO: req.body.BIO,
    EMAIL: req.body.EMAIL,
    FACEBOOK: req.body.FACEBOOK,
    TWITTER: req.body.TWITTER,
    LINKEDIN: req.body.LINKEDIN,
    EVENT_ID: req.params.id
  };
  let sql = "INSERT INTO attendees SET ? ";
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//update product
//app.put('/api/products/:id',(req, res) => {
//let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.params.id;
//let query = conn.query(sql, (err, results) => {
//  if(err) throw err;
//  res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//});
//});

//Delete attendee
app.delete("/api/attendees/:id", (req, res) => {
  let sql = "DELETE FROM attendees WHERE ID=" + req.params.id + "";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//Server listening
//if(process.env.NODE_ENV=== 'production')
// {
//setstatic folder
//  app.use(express.static('client/build'));
//  app.get('*',(req,res)=>{
//    res.sendFile(path.resolve(__dirname,'client','build','index.html'));

//  });
// }
app.timeout = 0;
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server started on port 5000...");
});

/**
 * Get All emails of registered Event organisers
 */
app.get("/api/event/getEventEmails/:id", (req, res) => {
  let sql = "SELECT ORG_EMAIL FROM event";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

/**
 * Get All emails of registered event attendees
 */
app.get("/api/attendees/getAttendeeEmails/:id", (req, res) => {
  let sql = "SELECT EMAIL FROM attendees";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

/**
 * Get All emails of registered event attendees
 */
app.get("/api/attendees/getAttendeeEmails/:id", (req, res) => {
  let sql = "SELECT EMAIL FROM attendees";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

/**
 * Get all attendees with given name/company/email for an event from admin page
 */
app.post("/api/attendees/searchAttendee/:event", (req, res) => {
  let data = { NAME: req.body.NAME };
  let secondParam;
  if (req.body.NAME) {
    secondParam = ` AND NAME="${req.body.NAME}"`;
  } else if (req.body.COMPANY) {
    secondParam = ` AND COMPANY="${req.body.COMPANY}"`;
  } else if (req.body.EMAIL) {
    secondParam = ` AND EMAIL="${req.body.EMAIL}"`;
  } else if (req.body.ID === "*") {
    secondParam = "";
  } else {
    throw err;
  }

  let sql = `SELECT * FROM attendees WHERE EVENT_ID=${req.params.event}${secondParam}`;
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});
