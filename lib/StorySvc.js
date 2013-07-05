var logger = require('winston').loggers.get('default'),
	ObjectSvc = require('./ObjectSvc');

var StorySvc = function() {

	var self = this;

	this.getLatest = function(callback) {
		ObjectSvc.db.collection('story').find({}, {sort: [['created','desc']], limit: 20}).toArray(callback);
	}

	this.setFirstPage = function(storyId, pageId, callback) {
		self.update(storyId, { $set: { firstPage: pageId } }, callback);
	}

};

StorySvc.prototype = new ObjectSvc('story');
module.exports = StorySvc;