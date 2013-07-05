var ObjectSvc = require('../lib/ObjectSvc.js'),
	PageSvc = require('../lib/PageSvc.js'),
	StorySvc = require('../lib/StorySvc.js'),
	// logger = require('winston').loggers.get('default'),
	Hapi = require('hapi');

module.exports = function CrudController() {

	var self = this;
	this.pageSvc = new PageSvc();
	this.storySvc = new StorySvc();
	this.authorSvc = new ObjectSvc('author');

	this.getCallback = function(err, object, request) {
		if(err) request.reply(Hapi.error.internal("Internal server error"));
		else if(!object) request.reply(Hapi.error.notFound());
		else request.reply(object);
	};

	this.createCallback = function(err, object, request, route) {
		if(err) {
			request.reply(Hapi.error.internal("Internal server error"));
		} else {
			var response = new Hapi.response.Obj(object);
			response.created(route + '/' + object._id);
			request.reply(response);
		}
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
			author: request.auth.credentials,
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

	this.latestStories = function(request) {
		self.storySvc.getLatest(function(err, stories) {
			self.getCallback(err, stories, request);
		});
	};

	this.createStory = function(request) {
		var newStory = {
			author: request.auth.credentials,
			title: request.payload.title,
			category: request.payload.category,
			upvotes: 0,
			downvotes: 0,
			created: new Date().getTime()
		};

		self.storySvc.create(newStory, function(err, storyObj) {
			if(err) {
				return self.createCallback(err);
			}

			var newPage = {
				author: request.auth.credentials,
				story:	storyObj._id,
				body:	request.payload.firstPage,
				upvotes: 0,
				downvotes: 0,
				created: new Date().getTime()
			};
			self.pageSvc.create(newPage, function(err, pageObj) {
				self.storySvc.setFirstPage(storyObj._id, pageObj._id, function(err, updated) {
					if(err) {
						self.createCallback(err);
					} else if (!updated) {
						self.createCallback(new Error("Could not attach first page to story!"));
					} else {
						storyObj.firstPage = pageObj._id;
						self.createCallback(err, storyObj, request, '/story');
					}
				})
			});
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