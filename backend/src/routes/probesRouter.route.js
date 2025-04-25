const probesRouter = require('express').Router();

probesRouter.get('/', (req, res) => {
  return res.json({
    status: 'OK',
    message: 'API is up and accepting requests'
  });
});

module.exports = probesRouter;
