'use strict';

// todo 모카 실행시 파라미터를 받아서 실행을 진행될 수 있도록 할 것 (영상 참고)
// todo --target=mobile (mobile, pc, api, admin) -> 예시

const assert = require('assert');
const request = require('request');
const expect = require('chai').expect;
const JSON = require('JSON');
const should = require('should');
const HOST = 'http://localhost:3002/';
const HOST_API = `${HOST}api/v2/`;

describe('[API 2.0] Should return 200', () => {

	describe('Broadcast Signal', () => {
		it('/broadcast/live', (done) =>{
			request.get(`${HOST_API}broadcast/live`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});

	describe('[Navigation] channel list', () => {
		it('/navigation/channel/list', (done) => {
			request.get(`${HOST_API}navigation/channel/list`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				// console.info(body);
				done();
			});
		});
	});


	describe('Navigation Recommend list', () => {
		it('/navigation/recommend/list', (done) => {
			request.get(`${HOST_API}navigation/recommend/list`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				// console.info(body);
				done();
			});
		});
	});


	describe('Event', () => {
		it('/event/list', (done) => {
			request.get(`${HOST_API}event/list?offset=0&size=100`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});


	describe('Event Result', () => {
		it('/event/result/3', (done) => {
			request.get(`${HOST_API}event/result/3`, (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				let _body = JSON.parse(body);
				expect(_body.result.length).to.not.equal(0);
				expect(_body.success).to.be.true;
				// console.log(body);
				done();
			});
		});
	});


	describe('Event on Vote Question', () => {
		it('/event/vote/question/:id', (done) => {
			request.get(`${HOST_API}event/vote/question/13`, (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				let _body = JSON.parse(body);
				expect(_body.result.length).to.not.equal(0);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});

	describe('Event on Vote Answer', () => {
		it('/event/vote/answer/:id', (done) => {
			request.get(`${HOST_API}event/vote/answer/14`, (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				let _body = JSON.parse(body);
				expect(_body.result.length).to.not.equal(0);
				expect(_body.success).to.be.true;
				// console.info(body);
				done();
			});
		});
	});


	describe('Recent updated Video', () => {
		it('/video/recent/list?offset=0&size=4', (done) => {
			request.get(`${HOST_API}video/recent/list?offset=0&size=4`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				// console.info(body);
				done();
			});
		});
	});


	describe('Representative Channel List', () => {
		it('/contents/representative/list?offset=0&size=4', (done) => {
			request.get(`${HOST_API}contents/representative/list?offset=0&size=4`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});


	describe('Education Video List', () => {
		it('/contents/education/list?offset=0&size=4', (done) => {
			request.get(`${HOST_API}contents/education/list?offset=0&size=4`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});


	describe('Summary Video List', () => {
		it('/contents/summary/list?offset=0&size=4', (done) => {
			request.get(`${HOST_API}contents/summary/list?offset=0&size=4`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});


	describe('Get Video List by Channel_id', () => {
		it('/video/list/:channel_id', (done) => {
			request.get(`${HOST_API}video/list/385bc900-90f7-11e6-876f-719554daeebf`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});


	describe('Get Channel info by its ID', () => {
		it('/channel/:channel_id/information', (done) => {
			request.get(`${HOST_API}channel/385bc900-90f7-11e6-876f-719554daeebf/information`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});



});