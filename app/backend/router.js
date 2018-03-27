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
  sync
} = require('./util');

router.get('/', (req, res) => res.send('Server running'));

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
            config: null
          });
        });
    })
    .catch(() => {
      res.json({ docker: false });
    });
});

router.post('/tap/schema/', (req, res) => {
  addSchema(req.body.config)
    .then((schema) => {
      res.json(schema.streams);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get('/schema/', (req, res) => {
  readSchema()
    .then((schema) => res.json(schema.streams))
    .catch((err) => {
      res.json(err);
    });
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
    .then((taps) => res.json(taps))
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
  console.log('About to start');
  sync()
    .then(() => {
      console.log('COmplete');
      res.json({ status: 200 });
    })
    .catch((err) => {
      console.log('error', err);
      res.json({ status: 500 });
    });
});

module.exports = router;
