var mongo = require('../lib/mongo.js'),
	logger = require('winston').loggers.get('default');

exports.getById = function(id, callback) {
	mongo.getDb(function(err, db) {
		if(err) {
			logger.error("Failed to get db: " + err.message);
			return callback(err);
		}

		db.collection('pages').findOne({id: id}, function(err, page) {
			if(err) {
				logger.error("Failed to get pages collection from mongodb: " + err.message);
				return callback(err);
			}
			if(!page) {
				logger.warn("Page not found with id " + id);
				return callback();
			}
			return callback(null, page);
		});
	});
};

exports.create = function(pageObj, callback) {
	mongo.getDb(function(err, db) {
		if(err) {
			logger.error('Could not get db: ' + err.message);
			return callback(err);
		} else {
			db.collection('pages').insert(request.payload, { safe: true }, function(err, pages) {
				if(err) {
					logger.error('Could not get pages collection: ' + err.message);
					return callback(err);
				} else {
					return callback(null, pages[0]);
				}
			});
		}
	})
};