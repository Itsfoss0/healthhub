/**
 * Connect to MongoDB
 */

const mongoose = require('mongoose');

const connectDBInstance = (URL) => {
  mongoose
    .connect(URL)
    .then(() => console.log(`Connected to instance running at ${URL}`))
    .catch((err) =>
      console.error('An error occured during a connection attempt', err)
    );
};

module.exports = connectDBInstance;
