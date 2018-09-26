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

const {
  getKnots,
  saveKnot,
  sync,
  deleteKnot,
  packageKnot,
  downloadKnot,
  loadValues,
  loadKnot,
  cancel,
  seedState
} = require('../knots');

router.get('/', (req, res) => {
  getKnots()
    .then((knots) => res.json({ knots }))
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/save/', (req, res) => {
  const { knotName, currentName, uuid } = req.body;

  saveKnot(knotName, uuid, currentName)
    .then(() => {
      sync(req);
      res.json({});
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/delete/', (req, res) => {
  // eslint-disable-next-line
  const { knot } = req.body;

  deleteKnot(knot)
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/download/', (req, res) => {
  // eslint-disable-next-line
  const { knot } = req.body;

  packageKnot(knot)
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.get('/download/', (req, res) => {
  downloadKnot(req, res);
});

router.post('/full-sync/', (req, res) => {
  sync(req);
  res.json({});
});

router.post('/partial-sync/', (req, res) => {
  sync(req, 'partial');
  res.json({});
});

router.post('/load/', (req, res) => {
  const { knot, uuid } = req.body;

  loadValues(knot, uuid)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/loadknot/', (req, res) => {
  const { knot } = req.body;

  loadKnot(knot)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/cancel/', (req, res) => {
  cancel(req.body.knot)
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post('/seed-state/', (req, res) => {
  const { stateObject, knotName } = req.body;
  seedState(stateObject, knotName)
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
