var mongo = require('../lib/mongo.js'),
	logger = require('winston').loggers.get('default');

exports.getById = function(id, callback) {
	mongo.getDb(function(err, db) {
		if(err) {
			logger.error("Failed to get db: " + err.message);
			return callback(err);
		}

		db.collection('stories').findOne({id: id}, function(err, story) {
			if(err) {
				logger.error("Failed to get stories collection from mongodb: " + err.message);
				return callback(err);
			}
			if(!story) {
				logger.warn("Story not found with id " + id);
				return callback();
			}
			return callback(null, story);
		});
	});
};

exports.create = function(storyObj, callback) {
	mongo.getDb(function(err, db) {
		if(err) {
			logger.error('Could not get db: ' + err.message);
			return callback(err);
		} else {
			db.collection('stories').insert(request.payload, { safe: true }, function(err, stories) {
				if(err) {
					logger.error('Could not get stories collection: ' + err.message);
					return callback(err);
				} else {
					return callback(null, stories[0]);
				}
			});
		}
	})
};