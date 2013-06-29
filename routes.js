var PageController = require('./controllers/PageController'),
	StoryController = require('./controllers/StoryController'),
	AuthenticationController = require('./controllers/AuthenticationController'),
	Hapi = require('hapi'),
	validator = require('./lib/validator.js');

exports.routes = [

	{ method: 'GET', path: '/page/{id}', config: {
		handler: PageController.getPage,
		validate: { path: { id: validator.mongoid.required() } } }
	},

	{ method: 'PUT', path: '/page', config: {
		handler: PageController.createPage,
		payload: 'parse',
		validate: { payload: validator.page } }
	},

	{ method: 'GET', path: '/story/{id}', config: {
		handler: StoryController.getStory,
		validate: { path: { id: validator.mongoid.required() } } }
	},

	{ method: 'PUT', path: '/story', config: {
		handler: StoryController.createStory,
		payload: 'parse',
		validate: { payload: validator.story } }
	},

	{ method: 'GET', path: '/auth/{type}', config: {
		handler: AuthenticationController.begin,
		validate: {
			path: { type: Hapi.types.String().valid(['google']) },
			query: { returnTo: Hapi.types.String().regex(/^http/) } } }
	},

	{ method: 'GET', path: '/authCallback', config: {
		handler: AuthenticationController.authCallback }
	}

];