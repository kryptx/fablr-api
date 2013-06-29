var config = require('../config.json'),
	logger = require('winston').loggers.get('default'),
	request = require('request'),
	jws = require('jws'),
	Hapi = require('hapi');

function randomString(length, chars) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}

// TODO: all kinds of error handling in this controller

exports.begin = function() {
	logger.debug("Attempting to authenticate user");
	if(this.params.type === 'google') {
		logger.debug("Constructing google URL");
		var stateToken = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
		logger.debug("State token: " + stateToken);
		this.session.set('stateToken', stateToken);
		var url = 'https://accounts.google.com/o/oauth2/auth' +
					'?client_id=' + config.auth.google.clientId +
					'&response_type=code' +
					'&scope=openid%20email' +
					'&redirect_uri=' + encodeURIComponent(config.auth.google.redirectUri) +
					'&state=' + stateToken + '%7C' + encodeURIComponent(this.query.returnTo || '');

		logger.debug("Redirecting to google");
		return this.reply.redirect(url).message("Redirecting to google for authentication...").permanent(true);
	}

	return this.reply(Hapi.Error.Internal("Invalid URL."));
};

exports.authCallback = function(hapiRequest) {

	// compare the state token in the url to that in the session
	logger.debug("Received auth callback");

	var stateParts = decodeURIComponent(hapiRequest.query.state).split('|');

	logger.debug("State parts: " + stateParts);
	logger.debug("State token from session: " + hapiRequest.session.get('stateToken'));

	// if they match, exchange the code for a token
	if(stateParts[0] === hapiRequest.session.get('stateToken')) {

		logger.debug("State token matches, retrieving id token");
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
			// put their e-mail address in the session; this will signify that they are "logged in"
			logger.debug("Decoding base64 JWT: " + body.id_token);
			var jwt = jws.decode(body.id_token);
			var id_payload = JSON.parse(jwt.payload);
			logger.debug("User e-mail address: " + id_payload.email);
			hapiRequest.session.set('email', id_payload.email);

			// TODO: create an author if it doesn't yet exist
			// redirect them to where they were
			if(stateParts[1]) {
				hapiRequest.reply.redirect(stateParts[1]);
			} else {
				hapiRequest.reply.redirect(config.uiUrl);
			}
		});

	}
};