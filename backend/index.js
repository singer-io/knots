const express = require('express');

const app = express();
const router = require('./router');

app.use('/', router);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
