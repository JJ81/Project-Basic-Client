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


	describe('Get Video info by its ID', () => {
		it('/video/:video_id/information', (done) => {
			request.get(`${HOST_API}video/7475dfb0-90f8-11e6-8318-35085802b5fe/information`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});

	describe('Get News List', () => {
		it('/news/list', (done) => {
			request.get(`${HOST_API}news/list`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				expect(_body.result.length).to.not.equal(0);
				expect(_body.result.length).to.equal(4);
				//console.info(body);
				done();
			});
		});
	});


	describe('Get Reply List', () => {
		it('/reply/list/:video_id', (done) => {
			request.get(`${HOST_API}reply/list?video_id=297043e0-86d8-11e6-b591-0108467f781a&offset=0&size=1000`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				// console.info(body);
				done();
			});
		});
	});



	/// todo 여기서부터 테스트 시작
	// ref. https://thewayofcode.wordpress.com/2013/04/21/how-to-build-and-test-rest-api-with-nodejs-express-mocha/
	// todo 완성 후에 블로그에 설명을 적을 것

	let mockup_data = {
		video_id : '297043e0-86d8-11e6-b591-0108467f781a',
		user_id : 'player001',
		comment : 'REPLY TEST COMMENT',
		reply_id : null // create할 경우 리턴을 받아서 저장한다
	};


	describe('Read By its ID', () => {
		// Create
		it('Create Reply Test', (done) => {

		});

		// Read
		it('Read Reply Test', (done) => {

		});

		// Update
		it('Update Reply Test', (done) => {

		});

		// Delete
		it('Delete Reply Test', (done) => {

		});



		it('/reply/:user_id/:reply_id', (done) => {
			request.get(`${HOST_API}reply/player001/266`, (err, res, body) => {
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				// console.info(body);
				done();
			});
		});


	});



	// todo 덧글 리스트 테스트


	// todo 덧글 통합 테스트


	// todo application/json 타입으로 리턴된 것을 테스트한다.



});