const express = require('express');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const http = require('http');
const routes = require('./routes');
require('dotenv').config();
const terminate = require('terminate');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const { terminateDiscovery } = require('./taps');
const { terminateSync } = require('./knots');

app.use(bodyParser.json({ limit: '50mb' }));
app.use((req, res, next) => {
  req.io = io;
  next();
});

routes(app);

const PORT = 4321; // Random number that's unikely to clash with other apps

server.listen(PORT, () => console.log(`Knot server running on port ${PORT}`));

io.on('connection', (socket) => {
  console.log('Socket connected!');
  socket.on('terminate', (mode) => {
    let runningProcess;
    if (mode === 'discovery') {
      runningProcess = terminateDiscovery();
    } else if (mode === 'sync') {
      runningProcess = terminateSync();
    }

    terminate(runningProcess);
  });
});

io.on('disconnect', () => {
  console.log('Socket disconnected');
});
