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
	});

	describe('getPage', function() {
		it('should invoke pageSvc.getById with the provided argument', function() {
			var id = 'abc123';
			pageMock.expects("getById").once().withArgs(id);
			controller.getPage({ params: { id: id } });
			pageMock.verify();
		});
	});

	describe('getStory', function() {
		it('should invoke storySvc.getById with the provided argument', function() {
			var id = 'def456';
			storyMock.expects("getById").once().withArgs(id);
			controller.getStory({ params: { id: id } });
			storyMock.verify();
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