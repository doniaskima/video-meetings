const env = process.env.NODE_ENV || 'development';

module.exports = {
  env,
  isDev: env === 'development',
  isTest: env === 'test',
  isProd: env === 'production',
  port: process.env.PORT || 3001,
  dbUrl: process.env.MONGODB_URI,
  corsOrigin: process.env.CORS_ORIGIN,
  jwt: {
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
  },
};
