const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');



var connection = mysql.createConnection({
  host :"localhost",
  user:"root",
  password:"ssangcs11",
  port: 3306,
  database :"url_shortener"
});

connection.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "\\write.html");
});

app.get('/:sturl', function(req,res){
  connection.query('select origianlurl from topic where binary(shortedurl) = ?', 
  [req.params.sturl], function(err, results) {
    if(err||results.length==0)
      console.log("404");
    else
      res.redirect(results[0].origianlurl);
  });
})

app.post('/data',function(req,res){
  var ha = randomString(8);
  var ja = req.body.lnk;
  connection.query('insert into topic (shortedurl,origianlurl) VALUES (?,?)',
  [ha,ja] ,function(err,rows){
    if(err)
      console.log("404");
    else
      res.send(ha);
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

function randomString(length){
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var res="";
  for(var i = 0;i<length;i++){
    res+=charset[Math.floor(Math.random()*charset.length)];
  }
  return res;
}