/**
 * Created by cheese on 2017. 2. 16..
 */

const
	express = require('express'),
	router = express.Router(),
	request = require('request');

const HOST_INFO = {
	LOCAL: 'http://localhost:3002/api/',
	DEV: 'http://beta.holdemclub.tv/api/',
	REAL: 'http://holdemclub.tv/api/',
	VERSION: 'v1'
};

const HOST = `${HOST_INFO.LOCAL}${HOST_INFO.VERSION}`;


router.get('/', (req, res)=>{
  
});

module.exports = router;
