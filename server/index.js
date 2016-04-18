var http = require('http'),
  express = require('express'),
  path = require('path'),
  Server = require('mongodb').Server,
  config = require('./config');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/xebia-library');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongodb connection success');
  // we're connected!
});
var app = express();
var server = http.createServer(app).listen(config.server.port, function(){
  console.log('Express server listening on port ' + '8080');
});

var bookSchema = mongoose.Schema({
  name: String,
  isbn: String,
  bought: Number
});
var Book = mongoose.model('Books', bookSchema);

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('selectedBooks', function(books){
    for (var i in books) {
      var bookToSave = new Book({ name: books[i].title, isbn: books[i].isbn, bought: 1 });
      bookToSave.save(function (err) {
        if (err) return console.error(err);
      });
    }
    console.log(books);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});




app.get('/', function (req, res) {
  res.send('<html><body><h1>Welcome to Xebia Library Server</h1></body></html>');
});