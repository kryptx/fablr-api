var assert = require('assert'),
	sinon = require('sinon'),
	Hapi = require('hapi'),
	CrudController = require('../../controllers/CrudController.js'),
	ObjectSvc = require('../../lib/ObjectSvc.js');

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
});