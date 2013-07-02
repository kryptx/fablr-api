var logger = require('winston').loggers.get('default'),
	ObjectID = require('mongodb').ObjectID,
	ObjectSvc = require('./ObjectSvc');

var PageSvc = function() {

	var self = this;

	this.addOption = function(sourceId, targetId, optionText, callback) {

		// sourceId type should be fixed by ObjectSvc.update
		if(typeof targetId === 'string') targetId = new ObjectID(targetId);

		self.update(sourceId, { $push: { options: { optionText: optionText, target: targetId } } }, function(err, updated) {
			if(err) {
				callback(err);
			} else if (!updated) {
				callback(new Error("Option was not added."));
			} else {
				callback(null);
			}
		});
	}

};

PageSvc.prototype = new ObjectSvc('page');
module.exports = PageSvc;