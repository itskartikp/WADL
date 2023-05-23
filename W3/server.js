const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


app.listen(3007, function(){
  console.log("Server is running on port 3000.");
})

app.get("/",function(req,res){
  res.sendfile("index.html")
})

app.post("/",function(req,res){
  var fname = req.body.fname;
  var lname = req.body.lname;
  res.send({fname: fname, lname: lname});
})

app.get("/submit",function(req,res){
  res.render("submit", {fname: req.query.fname, lname: req.query.lname});
})