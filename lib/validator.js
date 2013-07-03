var Hapi = require('hapi');

exports.mongoid = Hapi.types.String().min(24).max(24);
exports.mongoid_required = Hapi.types.String().min(24).max(24).required();

exports.option = {
	optionText: 	Hapi.types.String().min(1).max(256),
	source:			exports.mongoid_required,
	target: 		exports.mongoid_required
};

exports.page = {
	_id: 		exports.mongoid,
	story: 		exports.mongoid_required,
	body: 		Hapi.types.String().min(1),
	optionText: Hapi.types.String().min(1).max(256),
	source:		exports.mongoid_required
};

exports.story = {
	_id: 		exports.mongoid,
	title: 		Hapi.types.String().min(3).max(256).required(),
	category:	Hapi.types.String().min(3).max(32).required(),
	firstPage:	Hapi.types.String().min(1)
};