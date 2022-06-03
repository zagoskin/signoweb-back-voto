const dbConfig = require('../config/db.config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  });

  const db = {};

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.enquete = require("./enquete.model.js")(sequelize, Sequelize);
  db.opcao = require("./opcao.model.js")(sequelize, Sequelize);

  db.opcao.belongsTo(db.enquete, {
    foreignKey: 'enqueteId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  db.enquete.hasMany(db.opcao, { 
    foreignKey: 'enqueteId',
    as: 'opcoes'
  });
 
  

  module.exports = db;
  