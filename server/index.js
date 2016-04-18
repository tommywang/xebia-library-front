var http = require('http'),
  express = require('express'),
  config = require('./config'),
  mongoose = require('mongoose');
var db = mongoose.connection;
var app = express();
var server = http.createServer(app).listen(config.server.port, function(){
  console.log('Express server listening on port ' + config.server.port);
});
var io = require('socket.io').listen(server);

//Create Model
var bookSchema = mongoose.Schema({
  name: String,
  isbn: String,
  bought: Number
});
var Book = mongoose.model('Books', bookSchema);
mongoose.connect(config.mongo.uri);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongodb connection success');
  seed();
});


io.sockets.on('connection', function (socket) {
  console.log('a user connected');
  //Save selected books
  socket.on('selectedBooks', function(books){
    for (var i in books) {
      Book.findOneAndUpdate({ isbn: books[i].isbn }, {
        $inc: { bought: books[i].number }
      }).exec(function(err, db_res) {
        if (err) {
          throw err;
        }
        else {
          console.log(db_res);
        }
      });
    }
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

//Pre-save all books if they does not exists
function seed(){
  var url = 'http://henri-potier.xebia.fr/books';
  http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
      body += chunk;
    });

    res.on('end', function(){
      var books = JSON.parse(body);
      for (var i in books) {
        var bookToSave = new Book({ name: books[i].title, isbn: books[i].isbn, bought: 0});
        Book.update({isbn: bookToSave.isbn},
          {$setOnInsert : bookToSave},
          {upsert: true}
          , function(err, numberAffected, rawResponse) {
            //console.log(err);
          })
      }
    });
  }).on('error', function(e){
    console.log("Got an error: ", e);
  });
}

//Show records
app.get('/', function (req, res) {
  var output = '<html><body><h1>Welcome to Xebia Library Server</h1><ul>';
  Book.find({}, function(err, books) {
    books.forEach(function(book) {
      output += '<li>';
      output += '<div>'+book.name+'</div>';
      output += '<div>'+book.isbn+'</div>';
      output += '<div>'+book.bought+'</div>';
      output += '</li>'
    });
    output += '</ul></body></html>';
    res.send(output);
  });
});