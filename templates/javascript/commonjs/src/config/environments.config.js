const environments = {
  port: Number(process.env.PORT) || 8080,
  jwtSecret: process.env.JWT_SECRET || "secret",
  host: process.env.HOST || "localhost",
  databaseName: process.env.DATABASE_NAME,
  databaseUser: process.env.USER_DATA_BASE,
  databasePassword: process.env.PASSWORD_DATA_BASE,
  databasePort: process.env.PORT_DATA_BASE,
  sslPathKey: process.env.PATH_SSL_KEY,
  sslPathCredentials: process.env.PATH_SSL_CREDENTIALS,
};

module.exports = environments;