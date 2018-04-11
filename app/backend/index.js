const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');
const socketIo = require('socket.io');
const http = require('http');

const app = express();
const PORT = 4321; // Random number that's unikely to clash with other apps

const server = http.createServer(app);

app.use(bodyParser.json());
app.use('/', router);
const io = socketIo(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

server.listen(PORT, () => console.log(`Knot server running on port ${PORT}`));

io.on('connection', () => {
  console.log('socket connected!');
});

io.on('disconnect', () => {
  console.log('socket disconnected');
});
