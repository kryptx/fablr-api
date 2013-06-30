var Hapi = require('hapi'),
	winston = require('winston'),
	server = Hapi.createServer(8080),
	routes = require('./routes.js').routes,
	mongo = require('./lib/mongo.js'),
	ObjectSvc = require('./lib/ObjectSvc.js'),
	config = require('./config.json');

winston.loggers.add('default', {
	console: {
		level: 'debug',
		timestamp: true
	}
});

server.auth('default', {
	scheme: 'cookie',
	password: config.auth.cookiePassword,
	cookie: 'sid',
	isSecure: false
});

server.route(routes);

mongo.init(function(db) {
	ObjectSvc.db = db;
	server.start(function() {
		winston.info("Server started at " + server.info.uri);
	});
});