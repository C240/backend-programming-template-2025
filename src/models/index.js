const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const config = require('../core/config');
const logger = require('../core/logger')('app');

const connect = async () => {
  try {
    const connectionString = config.database.connection;
    const dbName = config.database.name;

    // Log connection attempt
    logger.info(`Attempting to connect to MongoDB with database: ${dbName}`);

    await mongoose.connect(connectionString, {
      dbName,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    logger.info('Successfully connected to MongoDB');
  } catch (error) {
    logger.error({
      msg: 'Error connecting to MongoDB',
      error: error.message,
      code: error.code,
      name: error.name,
    });
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('error', (error) => {
  logger.error({
    msg: 'MongoDB connection error',
    error: error.message,
    code: error.code,
    name: error.name,
  });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

// Connect to MongoDB
connect();

const db = mongoose.connection;
const dbExports = { db };

// Load models
const basename = path.basename(__filename);
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const model = require(path.join(__dirname, file))(mongoose);
    dbExports[model.modelName] = model;
  });

module.exports = dbExports;
