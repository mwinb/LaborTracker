var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var db = require('./database.js');
var http = require('http')

var app = express(); 

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'));

app.use(session({
  cookieName: 'session',
  secret: 'imasecret',
  resave: false,
  saveUninitialized: false
}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})



app.get('/getLast/', db.getLast);

app.delete('/deleteOne', db.removeUtil);

app.get('/getDay/:day/:month/:year', db.viewDay);

app.get('/view/:year', db.viewYear);

app.get('/view/:week/:fMonth/:year', db.viewWeek);

app.get('/view/:fMonth/:year', db.viewMonth);

app.post('/add', db.addDate);

app.post('/updateDB', db.updateUtilization);

app.get('/checkLogin', db.checkSession);

app.post('/login', db.login);




var server = app.listen(port,function ()  {
  console.log("Server running at " + port);
});




