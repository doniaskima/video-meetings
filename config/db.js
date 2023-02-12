const mongoose = require('mongoose');
const { dbUrl } = require('./');

module.exports = async (url = dbUrl, opts = {}) => {
  try {
    const connection = await mongoose.connect(url, {
      ...opts,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('DB connected');

    return connection.connection.db;
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
