const express = require('express');
const router = require('./router');

const app = express();
const PORT = 4321; // Random number that's unikely to clash with other apps

app.use('/', router);

app.listen(PORT, () => console.log(`Knot server running on port ${PORT}`));
