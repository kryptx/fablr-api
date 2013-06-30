var assert = require('assert'),
	sinon = require('sinon'),
	Hapi = require('hapi'),
	CrudController = require('../../controllers/CrudController.js');

describe('CrudController', function() {
	var controller;
	beforeEach(function() {
		controller = new CrudController();
		pageMock = sinon.mock(controller.pageSvc);
		storyMock = sinon.mock(controller.storySvc);
		authorMock = sinon.mock(controller.authorSvc);
	});

	describe('getPage', function() {
		it('should invoke pageSvc.findById with the provided argument', function() {
			var id = 'abc123';
			pageMock.expects("findById").once().withArgs(id);
			controller.getPage({ params: { id: id } });
			pageMock.verify();
		});
	});

	describe('getStory', function() {
		it('should invoke storySvc.findById with the provided argument', function() {
			var id = 'def456';
			storyMock.expects("findById").once().withArgs(id);
			controller.getStory({ params: { id: id } });
			storyMock.verify();
		});
	});

	describe('getAuthor', function() {
		it('should invoke authorSvc.findById with the provided argument', function() {
			var id = 'def456';
			authorMock.expects("findById").once().withArgs(id);
			controller.getAuthor({ params: { id: id } });
			authorMock.verify();
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
		it('should invoke pageSvc.create with the given payload', function() {
			var payload = { key: "value", anotherKey: "anotherValue" };
			pageMock.expects("create").once().withArgs(payload);
			controller.createPage({ payload: payload });
			pageMock.verify();
		});
	});

	describe('createStory', function() {
		it('should invoke storySvc.create with the given payload', function() {
			var payload = { key: "value", anotherKey: "anotherValue" };
			storyMock.expects("create").once().withArgs(payload);
			controller.createStory({ payload: payload });
			storyMock.verify();
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