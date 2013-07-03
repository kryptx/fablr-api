var assert = require('assert'),
	sinon = require('sinon'),
	Hapi = require('hapi'),
	CrudController = require('../../controllers/CrudController.js');

describe('CrudController', function() {
	var controller;
	beforeEach(function() {
		controller = new CrudController();
	});

	describe('getPage', function() {
		it('should invoke pageSvc.findById with the provided argument', function() {
			var id = 'abc123';
			controller.pageSvc.findById = sinon.spy();
			controller.getPage({ params: { id: id } });
			assert(controller.pageSvc.findById.calledWith(id));
		});
	});

	describe('getStory', function() {
		it('should invoke storySvc.findById with the provided argument', function() {
			var id = 'def456';
			controller.storySvc.findById = sinon.spy();
			controller.getStory({ params: { id: id } });
			assert(controller.storySvc.findById.calledWith(id));
		});
	});

	describe('getAuthor', function() {
		it('should invoke authorSvc.findById with the provided argument', function() {
			var id = 'def456';
			controller.authorSvc.findById = sinon.spy();
			controller.getAuthor({ params: { id: id } });
			assert(controller.authorSvc.findById.calledWith(id));
		});

		it('should reply with a 404 if no id and no auth', function() {
			var request = { reply: sinon.spy(), params: { }, auth: { isAuthenticated: false } };
			controller.getAuthor(request);
			var err = Hapi.error.notFound();
			assert(request.reply.args[0][0].payload === err.payload);
			assert(request.reply.args[0][0].response.code === err.response.code);
		});

		it('should reply with credentials if authenticated and given no id', function() {
			var request = { reply: sinon.spy(), params: { }, auth: { isAuthenticated: true, credentials: { email: "test@test.com" } } };
			controller.getAuthor(request);
			assert(request.reply.calledOnce);
			assert(request.reply.args[0][0].email = request.auth.credentials.email);
		});

	});

	describe('createPage', function() {
		it('should invoke pageSvc.create', function() {
			var payload = { story: "some-id", body: "some-text", author: "might-be-fake" };
			controller.pageSvc.create = sinon.spy();
			controller.createPage({ auth: { credentials: { _id: "123" } }, payload: payload });
			assert(controller.pageSvc.create.calledOnce);
		});
	});

	describe('createStory', function() {
		it('should invoke storySvc.create with the given payload and credentials id', function() {
			var payload = { key: "value", anotherKey: "anotherValue", author: "might-be-fake" };
			controller.storySvc.create = sinon.spy();
			controller.createStory({ auth: { credentials: { _id: "123" } }, payload: payload });
			controller.storySvc.create.calledWith(payload);
		});
	});

	describe('getCallback', function() {
		it('should return a 500 error if it receives an error object', function() {
			var request = { reply: sinon.spy() };
			controller.getCallback({ message: 'error info'}, null, request);
			var err = Hapi.error.internal("Internal server error");
			assert(request.reply.args[0][0].payload === err.payload);
			assert(request.reply.args[0][0].response.code === err.response.code);
		});
	});

	describe('createCallback', function() {
		it('should return a 500 error if it receives an error object', function() {
			var request = { reply: sinon.spy() };
			controller.createCallback({ message: 'error info'}, null, request, '/some/route');
			var err = Hapi.error.internal("Internal server error");
			assert(request.reply.args[0][0].payload === err.payload);
			assert(request.reply.args[0][0].response.code === err.response.code);
		});
	});
});