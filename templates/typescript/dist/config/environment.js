"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment = {
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    apiUser: process.env.API_USER_NAME,
    apiPassword: process.env.API_PASSWORD,
    host: process.env.HOST,
    bdName: process.env.BDNAME,
    userBd: process.env.USUARIO_BASE_DATOS,
    passswordBd: process.env.CONTRA_BASE_DATOS,
    portBd: process.env.PORT_BASE_DATOS,
    bd: process.env.BASE_DATOS,
    sslKey: process.env.SSLKEY,
    sslCredentials: process.env.SSLCREDENTIALS,
};
exports.default = environment;
