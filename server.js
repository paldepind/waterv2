var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , fs = require('fs')

players = 0;

server.listen(3000);

// We are storing the views in the current folder for convenience
app.set('views', '.');

// Set our default template engine to "jade"
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render('index', { request: 'no-name' });
});

io.sockets.on('connection', function (socket) {
    socket.emit('joined_game', players);
    players++;
    if (players == 2) {
        io.sockets.emit('game_state_change', "ready");
    }
    socket.on('game_state_change', function (state) {
        io.sockets.emit('game_state_change', state);
    });
    socket.on('mov', function (msg) {
        socket.broadcast.emit('mov', msg);
    });
    socket.on('disconnect', function() {
        players--;
    });
});
