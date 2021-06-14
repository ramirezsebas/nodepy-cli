const environment = {
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    apiUser: process.env.API_USER,
    apiPassword: process.env.API_PASSWORD,
    host: process.env.HOST,
    bdName: process.env.BD_NAME,
    userBd: process.env.USER_DATA_BASE,
    passswordBd: process.env.PASSWORD_DATA_BASE,
    portBd: process.env.PORT_DATA_BASE,
    bd: process.env.DATA_BASE,
    sslKey: process.env.SSL_KEY,
    sslCredentials: process.env.SSL_CREDENTIALS,
};

export default environment;
