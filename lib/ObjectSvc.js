module.exports = function ObjectSvc(collection) {

	var collection = collection;
	var db = ObjectSvc.db;

	this.getById = function(id, callback) {
		db.collection(collection).findOne({id: id}, function(err, obj) {
			if(err) {
				logger.error('Failed to get ' + collection + ' collection from mongodb: ' + err.message);
				return callback(err);
			}
			if(!page) {
				logger.warn('Object not found in collection ' + collection + ' with id ' + id);
				return callback();
			}
			return callback(null, obj);
		});
	}

	this.create = function(id, callback) {
		db.collection(collection).insert(request.payload, { safe: true }, function(err, objects) {
			if(err) {
				logger.error('Could not get ' + collection + ' collection: ' + err.message);
				return callback(err);
			} else {
				return callback(null, objects[0]);
			}
		});
	}
}