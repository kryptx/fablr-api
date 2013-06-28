var PageController = require('./controllers/PageController'),
	StoryController = require('./controllers/StoryController'),
	validator = require('./lib/validator.js');

exports.routes = [
	{ method: 'GET', path: '/page/{id}', config: { handler: PageController.getPage, validate: { path: { id: validator.mongoid.required() } } } }
	//{ method: 'POST', path: '/page', config: { handler: PageController.createPage, validate: { payload: validator.page } } },
	//{ method: 'GET', path: '/story/{id}', config: { handler: StoryController.getStory, validate: { payload: { id: validator.mongoid.required() } } } },
	//{ method: 'POST', path: '/story', config: { handler: StoryController.createStory, validate: { payload: validator.story } } }
];