import {
  bd,
  bdName,
  host,
  passswordBd,
  userBd,
} from "../../../commonjs/src/config/env_variables.js";

const sequelize = new Sequelize(bdName, userBd, passswordBd, {
  host: host,
  dialect: bd,
});

Object.freeze(sequelize);

export default sequelize;
