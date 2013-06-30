var Hapi = require('hapi');

exports.mongoid = Hapi.types.String().alphanum().min(24).max(24);

exports.option = {
	optionText: 	Hapi.types.String().min(1).max(256),
	destination: 	exports.mongoid
};

exports.page = {
	id: 		exports.mongoid,
	story: 		exports.mongoid.required(),
	parent: 	exports.mongoid,
	author:		exports.mongoid,
	body: 		Hapi.types.String().min(1),
	options: 	Hapi.types.Array().includes(exports.option)
};

exports.story = {
	id: 		exports.mongoid,
	title: 		Hapi.types.String().min(3).max(256),
	author: 	exports.author,
	startPage:	exports.mongoid
};

exports.author = {
	id: 		exports.mongoid,
	email: 		Hapi.types.String().email(),
	penName: 	Hapi.types.String().min(2).max(256),
	upvotes: 	Hapi.types.Number().min(0),
	downvotes: 	Hapi.types.Number().min(0),
	created: 	Hapi.types.Number().min(0),
	lastLogin: 	Hapi.types.Number().min(0)
};