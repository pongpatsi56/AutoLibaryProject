'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

console.log("--------------------------------");
console.log(config);
console.log("--------------------------------");

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


// const Sequelize = require('sequelize');

// let models = {};

// function getModels (config, force = false) {
//   if (Object.keys(models).length && !force) {
//     return models;
//   }

//   const sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     config.options
//   );

//   let modules = [
//     require('./AdminModel.js'),
//     require('./AllMembersModel.js'),
//     require('./SubfieldModel'),
//   ];

//   // Initialize models
//   modules.forEach((module) => {
//     const model = module(sequelize, Sequelize, config);
//     models[model.name] = model;
//   });

//   // Apply associations
//   Object.keys(models).forEach((key) => {
//     if ('associate' in models[key]) {
//       models[key].associate(models);
//     }
//   });

//   models.sequelize = sequelize;
//   models.Sequelize = Sequelize;

//   return models;
// }

// module.exports = {
//   getModels
// };