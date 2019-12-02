const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const cors=require('cors');
 
require('dotenv').config();
// parse application/json
app.use(bodyParser.json());
 app.use(cors());

 const host=process.env.DB_HOST;
 const user=process.env.DB_USER;
 const password=process.env.DB_PASSWORD;
 const database=process.env.DB_DATABASE;
//create database connection
const conn = mysql.createConnection({
  host: host,
  user:user,
  password: password,
  database: database
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//show all products
app.get('/api/attendees',(req, res) => {
  let sql = "SELECT * FROM attendees";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
 
//show single product
app.get('/api/attendees/:id',(req, res) => {
  let sql = "SELECT * FROM attendees WHERE ID="+req.params.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
 
//add new product
app.post('/api/attendees',(req, res) => {
  let data = {NAME: req.body.NAME, TITLE: req.body.TITLE,COMPANY: req.body.COMPANY,BIO:req.body.BIO,EMAIL:req.body.EMAIL,FACEBOOK:req.body.FACEBOOK,TWITTER:req.body.TWITTER,LINKEDIN:req.body.LINKEDIN};
  let sql = "INSERT INTO attendees SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
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
app.delete('/api/attendees/:id',(req, res) => {
  let sql = "DELETE FROM attendees WHERE ID="+req.params.id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
   res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
 
//Server listening
if(process.env.NODE_ENV=== 'production')
  {
    //setstatic folder
    app.use(express.static('client/build'));
    app.get('*',(req,res)=>{
      res.sendFile(path.resolve(__dirname,'client','build','index.html'));

    });
  }
app.timeout = 0;
const port= process.env.PORT || 5000;
app.listen(port,() =>{
  console.log('Server started on port 5000...');
});
 