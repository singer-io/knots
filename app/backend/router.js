const express = require('express');

const router = express.Router();
const { partialSync } = require('./util');

router.post('/sync/partial/', (req, res) => {
  partialSync(req)
    .then(() => {
      res.json({ status: 200 });
    })
    .catch(() => {
      res.json({ status: 500 });
    });
});

module.exports = router;
