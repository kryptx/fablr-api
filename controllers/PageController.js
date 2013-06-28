var mongo = require('../lib/mongo.js'),
	logger = require('winston').loggers.get('global'),
	Hapi = require('hapi');

exports.getPage = function(request) {

	mongo.getDb(function(err, db) {
		if(err) {
			request.reply(Hapi.error.internal("Internal server error"));
		} else {
			db.collection('pages').findOne({id: request.params.id}, function(err, page) {
				if(err) {
					logger.error("Failed to get collection from mongodb: " + err.message);
					request.reply(Hapi.error.internal("Internal server error"));
				} else if(page) {
					logger.debug("Page found, serving content");
					request.reply(page);
				} else {
					logger.warn("Page not found with id " + request.params.id);
					request.reply(Hapi.error.notFound());
				}
			});
		}
	});

}


exports.createPage = function(request) {

	// db.collection('pages').insert(request._payload);

}
