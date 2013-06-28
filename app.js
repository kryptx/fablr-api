var Hapi = require('hapi'),
	winston = require('winston'),
	server = Hapi.createServer(8080),
	routes = require('./routes.js').routes,
	mongo = require('./lib/mongo.js');

winston.loggers.add('global', {
	console: {
		level: 'debug',
		timestamp: true
	}
});

mongo.init();
server.route(routes);

// Start the server
server.start(function() {
	winston.info("Server started at " + server.info.uri);
});