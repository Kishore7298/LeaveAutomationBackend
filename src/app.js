const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require('morgan');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.get('/auth',(req,res)=>{
    MongoClient.connect(url, function(err, db) {
    if (err) console.log(err);
    var dbo = db.db("leaveautomation");
    dbo.collection("letters").find({email:req.query.email, password:req.query.password},{ projection: { _id: 0, email: 1,} }).toArray(function(err, result) {
      if (err) console.log(err);
      res.send({
        email: result,
        length: result.length
      });
      db.close();
    });
  });
})

app.get('/pending/',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("leaveautomation");
  dbo.collection("letters").find({email:req.query.email },{ projection: { _id: 0, to:1, reference:1, body:1} }).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
    db.close();
  });
});
})

app.get('/approved/',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("leaveautomation");
  dbo.collection("letters").find({email:req.query.email, toArrproved:true },{ projection: { _id: 0, to:1, reference:1, body:1} }).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
    db.close();
  });
});
})

app.get('/status/:id',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("leaveautomation");
  dbo.collection("letters").find({_id:req.params.id}).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
    db.close();
  });
});
});


app.listen(process.env.PORT || 8082)
