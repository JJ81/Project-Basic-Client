const assert = require('assert');
//import assert from 'assert'; // import는 사용할 수가 없다.

describe('Array', () => {

	describe('#indexOf()', () => {
		it('should return -1 when the value is not present', () => {
			assert.equal(-1, [1,2,3].indexOf(4));
		});
	});

});



