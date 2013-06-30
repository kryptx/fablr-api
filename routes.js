var CrudController = require('./controllers/CrudController'),
	crudController = new CrudController(),
	AuthenticationController = require('./controllers/AuthenticationController'),
	Hapi = require('hapi'),
	validator = require('./lib/validator.js');

exports.routes = [

	{ method: 'GET', path: '/page/{id}', config: {
		handler: crudController.getPage,
		validate: { path: { id: validator.mongoid.required() } },
		auth: { mode: 'try' } }
	},

	{ method: 'PUT', path: '/page', config: {
		handler: crudController.createPage,
		payload: 'parse',
		validate: { payload: validator.page },
		auth: true }
	},

	{ method: 'GET', path: '/story/{id}', config: {
		handler: crudController.getStory,
		validate: { path: { id: validator.mongoid.required() } },
		auth: { mode: 'try' } }
	},

	{ method: 'GET', path: '/author/{id}', config: {
		handler: crudController.getAuthor,
		validate: { path: { id: validator.mongoid.required() } },
		auth: { mode: 'try' } }
	},

	{ method: 'PUT', path: '/story', config: {
		handler: crudController.createStory,
		payload: 'parse',
		validate: { payload: validator.story },
		auth: true }
	},

	{ method: 'GET', path: '/auth/{type}', config: {
		handler: AuthenticationController.begin,
		validate: {
			path: { type: Hapi.types.String().valid(['google']).required() },
			query: { returnTo: Hapi.types.String().regex(/^http/) } },
		auth: { mode: 'try' } }
	},

	{ method: 'GET', path: '/authCallback', config: {
		handler: AuthenticationController.authCallback,
		auth: { mode: 'try' } }
	}

];