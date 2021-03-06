var ObjectID = require('mongodb').ObjectID,
	logger = require('winston').loggers.get('default');

module.exports = function ObjectSvc(collection) {

	var db = ObjectSvc.db;

	this.findById = function(id, callback) {
		if(typeof(id) === 'string') {
			id = new ObjectID(id);
		}
		db.collection(collection).findOne({_id: id}, function(err, obj) {
			if(err) {
				logger.error('Failed to get ' + collection + ' collection from mongodb: ' + err.message);
				return callback(err);
			}
			if(!obj) {
				logger.warn('Object not found in collection ' + collection + ' with id ' + id);
				return callback();
			}
			return callback(null, obj);
		});
	};

	this.findByField = function(fieldName, value, callback) {
		var query = {};
		query[fieldName] = value;
		db.collection(collection).find(query).toArray(function(err, objects) {
			if(err) {
				logger.error('Failed to get ' + collection + ' collection from mongodb: ' + err.message);
				return callback(err);
			}
			return callback(null, objects);
		});
	};

	this.create = function(object, callback) {
		db.collection(collection).insert(object, { safe: true }, function(err, objects) {
			if(err) {
				logger.error('Could not get ' + collection + ' collection: ' + err.message);
				return callback(err);
			} else {
				return callback(null, objects[0]);
			}
		});
	};

	this.update = function(id, update, callback) {
		if(typeof(id) === 'string') {
			id = new ObjectID(id);
		}
		db.collection(collection).update({_id: id}, update, callback);
	};

	// TODO: implement delete?
};