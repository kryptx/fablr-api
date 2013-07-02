var ObjectSvc = require('../lib/ObjectSvc.js'),
	PageSvc = require('../lib/PageSvc.js'),
	// logger = require('winston').loggers.get('default'),
	Hapi = require('hapi');

module.exports = function CrudController() {

	var self = this;
	this.pageSvc = new PageSvc();
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
		self.pageSvc.findById(request.params.id, function(err, page) {
			self.getCallback(err, page, request);
		});
	};

	this.createPage = function(request) {
		// TODO: validate that this user is allowed to insert this page into this story
		// i.e., the story exists, and is either public or this user is allowed
		var newPage = {
			author: request.auth.credentials._id,
			story:	request.payload.story,
			body:	request.payload.body,
			upvotes: 0,
			downvotes: 0,
			created: new Date().getTime()
		};

		// create the page, then upon success, link to it from the old page
		self.pageSvc.create(newPage, function(err, pageObj) {
			if(err) {
				return self.createCallback(err);
			}

			newOption.target = pageObj._id;
			self.pageSvc.addOption(request.payload.source, pageObj._id, request.payload.optionText, function(err) {
				self.createCallback(err, pageObj, request, '/page');
			});
		});
	};

	this.createOption = function(request) {
		self.pageSvc.addOption(request.payload.source, request.payload.target, request.payload.optionText, function(err) {
			self.createCallback(err, { _id: request.payload.source }, request, '/page');
		});
	};

	this.getStory = function(request) {
		self.storySvc.findById(request.params.id, function(err, story) {
			self.getCallback(err, story, request);
		});
	};

	this.createStory = function(request) {
		var newStory = request.payload;
		newStory.author = request.auth.credentials._id;
		self.storySvc.create(newStory, function(err, storyObj) {
			self.createCallback(err, storyObj, request, '/story');
		});
	};

	this.getAuthor = function(request) {
		if(request.params.id) {
			self.authorSvc.findById(request.params.id, function(err, author) {
				self.getCallback(err, author, request);
			});
		} else {
			if(request.auth.isAuthenticated) {
				request.reply(request.auth.credentials);
			} else {
				request.reply(Hapi.error.notFound());
			}
		}
	};
};