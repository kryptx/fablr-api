var config = require('../config/config.js'),
	logger = require('winston').loggers.get('default'),
	request = require('request'),
	crypto = require('crypto'),
	jws = require('jws'),
	Hapi = require('hapi'),
	ObjectSvc = require('../lib/ObjectSvc.js');

function randomString(length, chars) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}

// TODO: all kinds of error handling in this controller
// TODO: break this down into testable bits

function doRedirect(request, destination) {
	// redirect them to where they were
	if(destination) {
		request.reply.redirect(destination);
	} else {
		request.reply.redirect(config.uiUrl);
	}
}

var stateTokens = {};

exports.begin = function(request) {
	logger.debug("Attempting to authenticate user");
	if(request.params.type === 'google') {
		logger.debug("Constructing google URL");
		var stateToken = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
		logger.debug("State token: " + stateToken);
		stateTokens[stateToken] = setTimeout(function() {
			delete stateTokens[stateToken];
		}, 300000);
		logger.debug(stateTokens);

		var url = 'https://accounts.google.com/o/oauth2/auth' +
					'?client_id=' + config.auth.google.clientId +
					'&response_type=code' +
					'&scope=openid%20email' +
					'&redirect_uri=' + encodeURIComponent(config.auth.google.redirectUri) +
					'&state=' + stateToken + '%7C' + encodeURIComponent(request.query.returnTo || '');

		logger.debug("Redirecting to google");
		return request.reply.redirect(url).message("Redirecting to google for authentication...").permanent(true);
	}

	return request.reply(Hapi.Error.Internal("Invalid URL."));
};

exports.authCallback = function(hapiRequest) {

	// compare the state token in the url to those granted by the app
	logger.debug("Received auth callback");

	var stateParts = decodeURIComponent(hapiRequest.query.state).split('|');

	logger.debug("State parts: " + stateParts);
	logger.debug("Module state tokens: " + stateTokens.length);
	// if they match, exchange the code for a token
	if(stateTokens[stateParts[0]]) {

		clearTimeout(stateTokens[stateParts[0]]);
		delete stateTokens[stateParts[0]];

		logger.debug("State token validated, retrieving id token");
		// use the token to get the user's e-mail from google
		request.post('https://accounts.google.com/o/oauth2/token', {
			form: {
				code: hapiRequest.query.code,
				client_id: config.auth.google.clientId,
				client_secret: config.auth.google.clientSecret,
				redirect_uri: config.auth.google.redirectUri,
				grant_type: 'authorization_code'
			},
			json: true
		}, function(err, res, body) {

			logger.debug("Decoding JWT from google");
			var jwt = jws.decode(body.id_token);
			var id_payload = JSON.parse(jwt.payload);
			logger.debug("User e-mail address: " + id_payload.email);
			var authorSvc = new ObjectSvc('author');
			authorSvc.findByField('email', id_payload.email, function(err, authorsArray) {
				var nowTime = new Date().getTime();
				if(authorsArray.length === 0) {
					// create an author
					authorSvc.create({
						email: id_payload.email,
						penName: id_payload.email,
						upvotes: 0,
						downvotes: 0,
						created: nowTime,
						lastLogin: nowTime
					}, function(err, author) {
						if(err) {
							logger.error("Failed to create author: " + id_payload.email);
							return hapiRequest.reply(Hapi.error.internal("Internal server error"));
						} else {
							// set the author in the session
							logger.info("New author created: " + author.email);
							hapiRequest.auth.session.set(author);
							doRedirect(hapiRequest, stateParts[1]);
						}
					});
				} else if (authorsArray.length === 1) {
					// set the author in the session
					// TODO: set lastLogin
					logger.debug("Author logged in: " + authorsArray[0].email);
					hapiRequest.auth.session.set(authorsArray[0]);
					doRedirect(hapiRequest, stateParts[1]);
				} else {
					logger.error("Multiple authors found with e-mail address " + id_payload.email);
					return hapiRequest.reply(Hapi.error.internal("Internal server error"));
				}
			});

		});

	} else {
		logger.warn("Invalid or missing state token");
		return hapiRequest.reply(Hapi.error.internal("Internal server error"));
	}
};

exports.logout = function(hapiRequest) {
	hapiRequest.auth.session.clear();
	doRedirect(hapiRequest, config.uiUrl);
}