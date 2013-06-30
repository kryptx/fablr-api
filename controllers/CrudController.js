var ObjectSvc = require('../lib/ObjectSvc.js'),
	// logger = require('winston').loggers.get('default'),
	Hapi = require('hapi');

module.exports = function CrudController() {

	var self = this;
	this.pageSvc = new ObjectSvc('page');
	this.storySvc = new ObjectSvc('story');
	this.authorSvc = new ObjectSvc('author');

	this.getCallback = function(err, object, request) {
		if(err) request.reply(Hapi.error.internal("Internal server error"));
		else if(!object) request.reply(Hapi.error.notFound());
		else request.reply(object);
	};

	this.createCallback = function(err, object, request, route) {
		if(err) {
			request.reply(Hapi.error.internal("Internal server error"));
		}
		else request.reply(Hapi.response.Generic.created(route + '/' + object._id));
	};

	this.getPage = function(request) {
		self.pageSvc.getById(request.params.id, function(err, page) {
			self.getCallback(err, page, request);
		});
	};

	this.createPage = function(request) {
		// TODO: validate that this user is allowed to insert this page into this story
		self.pageSvc.create(request.payload, function(err, pageObj) {
			self.createCallback(err, pageObj, request, '/page');
		});
	};

	this.getStory = function(request) {
		self.storySvc.getById(request.params.id, function(err, story) {
			self.getCallback(err, story, request);
		});
	};

	this.createStory = function(request) {
		self.storySvc.create(request.payload, function(err, storyObj) {
			self.createCallback(err, storyObj, request, '/story');
		});
	};

	this.getAuthor = function(request) {
		self.authorSvc.getById(request.params.id, function(err, author) {
			self.getCallback(err, author, request);
		});
	};
};