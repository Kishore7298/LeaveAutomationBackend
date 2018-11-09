const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require('morgan');

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

//user authentication with email and password.
//returns email and name
app.get('/auth',(req,res)=>{
    MongoClient.connect(url, function(err, db) {
    if (err) console.log(err);
    var dbo = db.db("leaveautomation");
    dbo.collection("studentLogin").find({"email":req.query.email, "password":req.query.password},{ projection: { _id: 0, email: 1, name:1} }).toArray(function(err, result) {
      if (err) console.log(err);
      res.send({
        email: result,
        length: result.length
      });
      db.close();
    });
  });
});

//admin or lecturer authentication with email and password.
//returns just name
app.get('/adminauth',(req,res)=>{
    MongoClient.connect(url, function(err, db) {
    if (err) console.log(err);
    var dbo = db.db("leaveautomation");
    dbo.collection("adminLogin").find({"email":req.query.email, "password":req.query.password},{ projection: { _id: 0, name:1} }).toArray(function(err, result) {
      if (err) console.log(err);
      res.send({
        name: result,
        length: result.length
      });
      db.close();
    });
  });
});

app.get('/pending',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("leaveautomation");
  dbo.collection("letters").find({email:req.query.email, toApproved:false},{ projection: { _id: 0, to:1, through:1,sub:1, body:1} }).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
    db.close();
  });
});
});

//admin route to get the requests
app.get('/request',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("leaveautomation");
  dbo.collection("letters").find({to:req.query.name, toApproved:false, throughApproved:true},{ projection: { _id: 1, name:1, through:1,sub:1, body:1} }).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
    db.close();
  });
});
});

//admin route to get reference
app.get('/reference',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("leaveautomation");
  dbo.collection("letters").find({through:req.query.name, throughApproved:false},{ projection: { _id: 1, name:1, through:1,sub:1, body:1} }).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
    db.close();
  });
});
});

//admin route to get the approved list
app.get('/adminApproved',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("leaveautomation");
  dbo.collection("letters").find({$or:[{through:req.query.name, throughApproved:true},{to:req.query.name, toApproved:true}]},{ projection: { _id: 1, name:1, through:1,sub:1, body:1} })
  .toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
    db.close();
  });
});
});

app.get('/approved',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("leaveautomation");
  dbo.collection("letters").find({email:req.query.email, toApproved:true },{ projection: { _id: 1, to:1, through:1,sub:1, body:1} }).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
    db.close();
  });
});
})

app.get('/status',(req,res)=>{
  id = req.query.id
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("leaveautomation");
  dbo.collection("letters").find({_id: new ObjectID(id)}).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
    db.close();
  });
});
});

app.get('/admins',(req,res)=>{
    MongoClient.connect(url, function(err, db) {
    if (err) console.log(err);
    var dbo = db.db("leaveautomation");
    dbo.collection("adminLogin").find({},{ projection: { _id: 0, name: 1,} }).toArray(function(err, result) {
      if (err) console.log(err);
      res.send(result);
      db.close();
    });
  });
});

app.post('/submit',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("leaveautomation");
    dbo.collection("letters").insertOne(req.body , function(err, res) {
      if (err) throw err;
      db.close();
    });
  });
});

app.post('/approve',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("leaveautomation");
    dbo.collection("letters").update({_id:`ObjectId("${req.body.id}")`} ,{ $set:
      {
        "toApproved" : true
      }
   }, function(err, res) {
      if (err) throw err;
      db.close();
    });
  });
});

app.listen(process.env.PORT || 8082)
