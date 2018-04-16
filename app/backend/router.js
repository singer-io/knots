const express = require('express');
const axios = require('axios');

const router = express.Router();
const {
  getKnots,
  getTaps,
  detectDocker,
  addTap,
  addSchema,
  readSchema,
  writeSchema,
  getTargets,
  addTargetConfig,
  sync,
  addTarget,
  saveKnot
} = require('./util');

router.get('/', (req, res) => res.send('Server running'));

router.get('/callback', (req, res) => {
  res.send('Server running');
});

router.get('/knots', (req, res) => {
  getKnots()
    .then((knots) => res.json(knots))
    .catch(() => {
      res.json([]);
    });
});

router.get('/taps', (req, res) => {
  getTaps()
    .then((taps) => res.json(taps))
    .catch(() => {
      res.json([]);
    });
});

router.post('/taps/', (req, res) => {
  detectDocker()
    .then((dockerVersion) => {
      const { tap, version } = req.body;
      addTap(tap, version)
        .then((config) =>
          res.json({
            dockerVersion,
            config
          })
        )
        .catch(() => {
          res.json({
            dockerVersion,
            config: null
          });
        });
    })
    .catch(() => {
      res.json({ docker: false });
    });
});

router.post('/tap/schema/', (req, res) => {
  addSchema(req)
    .then((schema) => {
      res.json(schema.streams);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get('/schema/', (req, res) => {
  readSchema()
    .then((schema) => {
      res.json(schema.streams);
    })
    .catch();
});

router.put('/schema/', (req, res) => {
  writeSchema(req.body)
    .then(() => {
      res.json({ status: 200 });
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get('/targets/', (req, res) => {
  getTargets()
    .then((targets) => res.json(targets))
    .catch(() => {
      res.json([]);
    });
});

router.post('/target/install', (req, res) => {
  const { target, version } = req.body;
  addTarget(target, version)
    .then(() => {
      res.json({ status: 200 });
    })
    .catch(() => {
      res.json([]);
    });
});

router.get('/token/', (req, res) => {
  const { code } = req.body;
  const params = {
    code,
    client_id: 'knot-local',
    client_secret: 'iEcKy7joLVrJgtbm6YzzhTuxwsxU.jVb',
    grant_type: 'authorization_code'
  };
  const queryString = Object.keys(params)
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  axios
    .post(`https://data.world/oauth/access_token?${queryString}`)
    .then((response) => {
      if (response.data.access_token) {
        res.json({ token: response.data.access_token });
      }
    })
    .catch(console.log);
});

router.post('/target/', (req, res) => {
  addTargetConfig(req.body)
    .then(() => res.json({ status: 200 }))
    .catch(console.log);
});

router.get('/sync/', (req, res) => {
  sync(req)
    .then(() => {
      res.json({ status: 200 });
    })
    .catch(() => {
      res.json({ status: 500 });
    });
});

router.post('/save-knot/', (req, res) => {
  const { name } = req.body;
  saveKnot(name)
    .then(() => res.json({ all: 'good' }))
    .catch((err) => {
      console.log('This is the error', err);
    });
});

module.exports = router;
