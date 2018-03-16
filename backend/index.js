const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const router = require('./router');
const socketIo = require('socket.io');

const server = http.createServer(app);

app.use(bodyParser.json());
const io = socketIo(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/', router);
const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Listening on port ${port}`));

io.on('connection', () => {
  console.log('socket connected!');
});

io.on('disconnect', () => {
  console.log('user disconnected');
});
