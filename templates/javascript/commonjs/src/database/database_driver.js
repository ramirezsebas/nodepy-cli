const {
  bdName,
  bd,
  userBd,
  passswordBd,
  host,
} = require("../config/env_variables");

const sequelize = new Sequelize(bdName, userBd, passswordBd, {
  host: host,
  dialect: bd,
});

Object.freeze(sequelize);

module.exports = sequelize;
