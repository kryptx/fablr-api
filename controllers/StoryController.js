var Story = require('../models/Story.js'),
	logger = require('winston').loggers.get('default'),
	Hapi = require('hapi');

exports.getStory = function(request) {

	Story.getById(request.params.id, function(err, story) {
		if(err) request.reply(Hapi.error.Internal("Internal server error"));
		else if(!story) request.reply(Hapi.error.notFound());
		else request.reply(story);
	});
};

exports.createStory = function(request) {

	Story.create(request.payload, function(err, storyObj) {
		if(err) {
			request.reply(Hapi.error.Internal("Internal server error"));
		}

		request.reply(Hapi.response.Generic.created('/story/' + storyObj._id));
	});

};