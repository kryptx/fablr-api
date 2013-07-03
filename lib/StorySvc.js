var logger = require('winston').loggers.get('default'),
	ObjectSvc = require('./ObjectSvc');

var StorySvc = function() {

	this.getLatest = function(callback) {
		ObjectSvc.db.collection('story').find({}, {sort: [['created','desc']], limit: 20}).toArray(callback);
	}

};

StorySvc.prototype = new ObjectSvc('story');
module.exports = StorySvc;