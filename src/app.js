const http = require('http');

const socketio = require('socket.io');

const fs = require('fs');

let score = 0;

const handler = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.end();
  });
};

const app = http.createServer(handler);
app.listen(3000);

const io = socketio(app);

io.on('connection', (socket) => {
  socket.join('room1');

  socket.on('updateScore', (data) => {
    score += data;

    io.sockets.in('room1').emit('updated', score);
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log('listening on port 3000');
