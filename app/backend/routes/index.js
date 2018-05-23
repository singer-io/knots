const knotsRoutes = require('./knots');

const router = (app) => {
  app.use('/knots', knotsRoutes);
};

module.exports = router;
