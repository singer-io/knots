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

const router = require('express').Router();

const { getTaps, createKnot, addConfig, writeSchema } = require('../taps');

router.get('/', (req, res) => {
  getTaps()
    .then((taps) => res.json({ taps }))
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/select', (req, res) => {
  const { tap, knot, uuid } = req.body;

  createKnot(tap, uuid, !!knot)
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/config/', (req, res) => {
  addConfig(req)
    .then((schema) => {
      res.json({ schema: schema.streams });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.put('/schema/', (req, res) => {
  writeSchema(req.body.schema, req.body.uuid)
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
