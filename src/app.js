const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/auth/:email-:password',(req,res)=>{
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("leaveautomation");
    dbo.collection("letters").find({email:req.params.email, password:req.params.password},{ projection: { _id: 0, email: 1,} }).toArray(function(err, result) {
      if (err) throw err;
      res.send({
        email: result,
        length: result.length
      });
      db.close();
    });
  }); 
})

app.get('/pending/:email',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("leaveautomation");
  dbo.collection("letters").find({email:req.params.email },{ projection: { _id: 0, to:1, reference:1, body:1} }).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
    db.close();
  });
}); 
})

app.get('/approved/:email',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("leaveautomation");
  dbo.collection("letters").find({email:req.params.email, toArrproved:true },{ projection: { _id: 0, to:1, reference:1, body:1} }).toArray(function(err, result) {
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
})

app.get('/a/:email-:password',(req,res)=>{
  res.send(req.params);
})

app.listen(process.env.PORT || 8081)
