const envVariables = {
  puerto: process.env.PUERTO,
  jwtSecret: process.env.JWT_SECRET,
  apiUser: process.env.API_USER_NAME,
  apiPassword: process.env.API_PASSWORD,
  host: process.env.HOST,
  bdName: process.env.BDNAME,
  userBd: process.env.USUARIO_BASE_DATOS,
  passswordBd: process.env.CONTRA_BASE_DATOS,
  portBd: process.env.PORT_BASE_DATOS,
  bd: process.env.BASE_DATOS,
  sslKey: process.env.RUTA_CLAVE,
  sslCredentials: process.env.RUTA_CREEDENCIAL,
};

module.exports = envVariables;
