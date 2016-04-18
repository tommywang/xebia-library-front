app.factory('socket', function(){
    //Creating connection with server
  console.log('socket');
    var socket = io.connect('http://localhost:8080');
    socket.on('connect', function(){
        console.log('Socket connected');
    });
    return socket;

  });