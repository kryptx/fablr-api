var logger = require('winston').loggers.get('default'),
	ObjectSvc = require('ObjectSvc');

module.exports = function StorySvc() {

	var db = ObjectSvc.db;

};

StorySvc.prototype = new ObjectSvc('story');