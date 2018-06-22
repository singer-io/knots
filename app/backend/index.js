/*
 * knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the
 * License.
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc.(http://data.world/).
 */

const express = require('express');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const http = require('http');
const routes = require('./routes');
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
