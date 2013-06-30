var Hapi = require('hapi'),
	winston = require('winston'),
	server = Hapi.createServer(8080),
	routes = require('./routes.js').routes,
	mongo = require('./lib/mongo.js'),
	ObjectSvc = require('./lib/ObjectSvc.js');

winston.loggers.add('default', {
	console: {
		level: 'debug',
		timestamp: true
	}
});

var yarOptions = {
	cookieOptions: {
		password: 'password',
		isSecure: false
	}
};
server.pack.allow({ ext: true }).require('yar', yarOptions, function (err) { });
server.route(routes);


mongo.init(function(db) {
	ObjectSvc.db = db;
	server.start(function() {
		winston.info("Server started at " + server.info.uri);
	});
});