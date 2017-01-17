const request = require('request');
const BASE_URL = 'http://localhost:3002/';

describe('Hello World Test', function () {
	describe('GET /', function () {
		it('returns status code 200', function (done) {
			request.get(BASE_URL + 'test', function (error, response, body) {
				if(error){
					console.error(err);
					done();
				}
				expect(response.statusCode).toBe(200);
				done();
			});
		});
		
		it("returns Hello World", function(done) {
			request.get(BASE_URL + 'test', function(error, response, body) {
				if(error){
					console.error(err);
					done();
				}
				const value = JSON.parse(body).result;
				expect(value).toBe("Hello World");
				done();
			});
		});
		
		
	});
});