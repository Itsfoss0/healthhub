const api = require('./api');
const { PORT } = require('./config/env.config');

api.listen(PORT, () => {
  console.log(`API is ready... listening on PORT ${PORT}`);
});
