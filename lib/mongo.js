/**
 * 10gen recommends using a single db connection for the entire app
 * ideally the app won't start accepting requests until this is ready
 * since the controllers will try to use it
 */

var logger = require('winston').loggers.get('global'),
	_db,
	callbacksInWaiting = [];

exports.init = function() {
	var cString = require('../config.json').db.connectionString;
	logger.debug("Attempting to connect to mongodb with connection string " + cString);
	require('mongodb').MongoClient
		.connect(cString,
		{
			server: { auto_reconnect: true }
		},
		function(err, db) {
			if(err) {
				throw err;
			}
			logger.info("Database connection ready.");
			_db = db;
			for(var i = 0; i < callbacksInWaiting.length; i++) {
				callbacksInWaiting[i](err, db);
			}
		}
	);
}

exports.getDb = function(callback) {
	if(_db) return callback(null, _db);
	else {
		return callbacksInWaiting.push(callback);
	}
}
