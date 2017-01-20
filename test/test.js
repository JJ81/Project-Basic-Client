const assert = require('assert');
const request = require('request');
const expect = require('chai').expect;

describe('Should return 200', () => {

	it('Index Page', (done) =>{
		"use strict";
		request.get('http://localhost:3002/', (err, res, body) => {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});


	// todo 아래와 같이 에러 페이지가 호출되는 경우를 볼 수 있으므로 정확한 테스트 과정은 아니다
	// todo 따라서 아래와 같이 해당 페이지가 호출되는지 여부와 함께 해당 페이지에 특정 데이터가 올바르게 들어오고 있는지 확인할 수 있는 절차가 필요하다
	// todo channel페이지의 경우 뒤에 고유 아이디를 붙여서 호출을 할 수 있도록 되어 있는데 이것을 랜덤으로 가져와서 테스트를 할 수 있도록 할 것인지
	// todo 아니면 모든 채널 목록을 디비에서 가져와서 일일이 테스트할 것인지 판단을 해야 한다
	// todo 아마도 모든 페이지를 테스트를 자동화하는 것이므로 디비에서 가져온 모든 데이터를 조사하는 것이 좋겠다
	// todo 대신 채널 데이터 리스트는 실 디비에서 가져오지 않고 로컬이나 데브 디비에서 가져와서 테스트할 수 있도록 하며,
	// todo 실 서버에 있는 콘텐츠와 동일한 데이터로 업데이트 한 후에 테스트를 실행할 수 있도록 한다
	//
	it('Channel Page', (done) =>{
		"use strict";
		request.get('http://localhost:3002/channel', (err, res, body) => {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});


});