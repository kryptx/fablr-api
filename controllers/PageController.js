var Page = require('../models/Page.js'),
	logger = require('winston').loggers.get('default'),
	Hapi = require('hapi');

exports.getPage = function(request) {

	Page.getById(request.params.id, function(err, page) {
		if(err) request.reply(Hapi.error.Internal("Internal server error"));
		else if(!page) request.reply(Hapi.error.notFound());
		else request.reply(page);
	});
};

exports.createPage = function(request) {

	// TODO: validate that this user is allowed to insert this page into this story

	Page.save(request.payload, function(err, pageObj) {
		if(err) {
			request.reply(Hapi.error.Internal("Internal server error"));
		}

		request.reply(Hapi.response.Generic.created('/page/' + pageObj._id));
	});

};