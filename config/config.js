configFile = process.env.NODE_ENV || 'production';
module.exports = require('./' + configFile + '.json');