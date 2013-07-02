var Hapi = require('hapi');

exports.mongoid = Hapi.types.String().alphanum().min(24).max(24);

exports.option = {
	optionText: 	Hapi.types.String().min(1).max(256),
	source:			exports.mongoid.required(),
	target: 		exports.mongoid.required()
};

exports.page = {
	id: 		exports.mongoid,
	story: 		exports.mongoid.required(),
	body: 		Hapi.types.String().min(1),
	optionText: Hapi.types.String().min(1).max(256),
	source:		exports.mongoid.required()
};

exports.story = {
	id: 		exports.mongoid,
	title: 		Hapi.types.String().min(3).max(256),
	firstPage:	exports.mongoid.required()
};