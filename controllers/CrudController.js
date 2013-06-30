var ObjectSvc = require('../lib/ObjectSvc.js'),
	// logger = require('winston').loggers.get('default'),
	Hapi = require('hapi');

module.exports = function CrudController() {

	var self = this;
	this.pageSvc = new ObjectSvc('page');
	this.storySvc = new ObjectSvc('story');
	// this.authorSvc = new ObjectSvc('author');

	this.getPage = function(request) {
		self.pageSvc.getById(request.params.id, function(err, page) {
			if(err) request.reply(Hapi.error.Internal("Internal server error"));
			else if(!page) request.reply(Hapi.error.notFound());
			else request.reply(page);
		});
	};

	this.createPage = function(request) {

		// TODO: validate that this user is allowed to insert this page into this story
		self.pageSvc.create(request.payload, function(err, pageObj) {
			if(err) {
				request.reply(Hapi.error.Internal("Internal server error"));
			}

			request.reply(Hapi.response.Generic.created('/page/' + pageObj._id));
		});
	};

	this.getStory = function(request) {

		self.storySvc.getById(request.params.id, function(err, story) {
			if(err) request.reply(Hapi.error.Internal("Internal server error"));
			else if(!story) request.reply(Hapi.error.notFound());
			else request.reply(story);
		});
	};

	this.createStory = function(request) {

		self.storySvc.create(request.payload, function(err, storyObj) {
			if(err) {
				request.reply(Hapi.error.Internal("Internal server error"));
			}

			request.reply(Hapi.response.Generic.created('/story/' + storyObj._id));
		});

	};
};