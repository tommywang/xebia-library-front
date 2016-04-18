app.factory('socket', function(){
  var socket = io.connect('http://localhost:8080');
  socket.on('connect', function(){
    console.log('Socket connected');
    angular.element(".server-indicator ").addClass('connected');
  });
  socket.on('disconnect', function(){
    angular.element(".server-indicator ").removeClass('connected');
  });
  return socket;
});