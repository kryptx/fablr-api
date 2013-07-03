// kind of a hack:
var config = require('./config/config.js');
// require('./node_modules/hapi/lib/defaults.js').state.domain = config.cookieDomain;

var winston = require('winston'),
	Hapi = require('hapi'),
	server = Hapi.createServer(8080, config.hapi),
	mongo = require('./lib/mongo.js'),
	ObjectSvc = require('./lib/ObjectSvc.js');

winston.loggers.add('default', {
	console: {
		level: config.logLevel
	}
});

server.auth('default', {
	scheme: 'cookie',
	password: config.auth.cookiePassword,
	cookie: 'sid',
	isSecure: false,
	isHttpOnly: false,
	defaultMode: 'try'
});


mongo.init(config.db.connectionString, function(db) {
	ObjectSvc.db = db;
	server.route(require('./routes.js').routes);
	server.start(function() {
		winston.info("Server started at " + server.info.uri);
	});
});