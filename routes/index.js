const express = require('express');
const router = express.Router();
const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const async = require('async');
const QUERY = require('../database/query');
const JSON = require('JSON');
require('../database/redis')(router, 'local'); // redis
require('../helpers/helpers');

const request = require('request');
const STATIC_URL = 'http://static.holdemclub.tv/';

passport.serializeUser((user, done) => {
	console.log(user);
	done(null, user);
});

passport.deserializeUser((user, done) => {
	console.log(user);
	done(null, user);
});

var isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
};

passport.use(new LocalStrategy({
	usernameField: 'agent',
	passwordField: 'password',
	passReqToCallback: true
}, (req, agent, password, done) => {
	connection.query(QUERY.AGENT.login, [agent], (err, data) => {
		if (err) {
			return done(null, false);
		} else {
			if (data.length === 1) {
				if (!bcrypt.compareSync(password, data[0].password)) {
					console.log('password is not matched.');
					return done(null, false);
				} else {
					console.log('password is matched.');
					console.info(data[0]);
					return done(null, {
						'agent': data[0].code,
						'layer': data[0].layer,
						'parent_id': data[0].parent_id,
						'top_parent_id': data[0].top_parent_id,
						'balance': data[0].balance
					});
				}
			} else {
				return done(null, false);
			}
		}
	});
}
));

router.get('/login', function (req, res) {
	if (req.user == null) {
		res.render('login', {
			current_path: 'login',
			title: PROJ_TITLE + 'login'
		});
	} else {
		res.redirect('/');
	}
});

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: true
}), function (req, res) {
	res.redirect('/');
});

router.get('/logout', isAuthenticated, (req, res) => {
	req.logout();
	res.redirect('/');
});


/**
 * 메인 페이지
 */

// todo config 파일로 이동시키고 서버실행시 변경이 될 수 있도록 설정한다.
const HOST_INFO = {
	LOCAL : 'http://localhost:3002/api/',
	DEV : 'http://beta.holdemclub.tv/api/',
	REAL : 'http://holdemclub.tv/api/',
	VERSION : 'v2'
};

const HOST = `${HOST_INFO.LOCAL}${HOST_INFO.VERSION}`;
console.log(HOST);

router.get('/', (req, res) => {
	'use strict';

	async.parallel(
		[
			(cb) => { // 방송중
				request.get(`${HOST}/broadcast/live`, (err, res, body) => {
					if(!err && res.statusCode == 200){
						// console.log(typeof body);
						// console.log(body);
						// console.log(body.success);

						let _body = JSON.parse(body);

						if(_body.success){
							cb(null, _body);
						}else{
							console.error('[live] success status is false');
							cb(null, null);
						}
					}else{
						cb(err, null);
						console.error(err);
					}
				});
			},
			(cb) => { // 좌측 채널 리스트
				request.get(`${HOST}/navigation/channel/list`, (err, res, body)=>{
					let _body = JSON.parse(body);
					if(!err && res.statusCode == 200){
						if(_body.success){
							cb(null, _body);
						}else{
							console.error('[navi] success status is false');
							cb('Navigation', null);
						}
					}else{
						cb(err, null);
						console.error(err);
					}
				});
			},
			(cb) => { // 최신 업데이트 비디오
				request.get(`${HOST}/video/recent/list?size=3&offset=0`, (err, res, body)  => {
					let _body  = JSON.parse(body);
					if(!err && res.statusCode == 200){
						if(_body.success){
							cb(null, _body);
						}else{
							cb('Video', null);
						}
					}else{
						console.error('[video] recent 3 videos');
						cb(err, null);
					}
				});
			},
			(cb) => { // 추천 채널 리스트
				request.get(`${HOST}/navigation/recommend/list`, (err, res, body) => {
					let _body  = JSON.parse(body);
					if(!err && res.statusCode == 200){
						if(_body.success){
							cb(null, _body);
						}else{
							cb('Recom', null);
						}
					}else{
						console.error('[Recom] ');
						cb(err, null);
					}
				});
			}
		], (err, result) => {
		if (!err) {

			console.log('result');
			console.log(result);

			res.render('index', {
				current_path: 'INDEX',
				static : STATIC_URL,
				title: PROJ_TITLE,
				loggedIn: req.user,
				live : result[0].result,
				channels : result[1].result,
				videos : result[2].result,
				recom : result[3].result
			});
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

// TODO 모든 라우터에서 항상 추춴방송, 전체 채널, 방송 여부에 대한 데이터를 항상 데이터를 가져와야 한다
// TODO 위의 데이터는 Redis에 캐시를 하도록 한다


router.get('/event', (req, res) => {
	'use strict';

	// 임시로 100개의 이벤트 리스트를 가져온다.
	request.get(`${HOST}/event/list?offset=0&size=100`, (err, response, body) => {
		let _body  = JSON.parse(body);
		if(!err && response.statusCode == 200){
			if(_body.success){
				res.render('event', {
					current_path: 'EVENT',
					static : STATIC_URL,
					title: PROJ_TITLE,
					loggedIn: req.user,
					list : _body.result
				});
			}else{
				console.error(err);
				throw new Error(err);
			}
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});

// 이벤트 결과 페이지
router.get('/event/:id/result', (req, res) => {
	'use strict';

	request.get(`${HOST}/event/result/${req.params.id}`, (err, response, body) => {
		let _body  = JSON.parse(body);
		if(!err && response.statusCode == 200){
			if(_body.success){
				res.render('event_result', {
					current_path: 'EVENT',
					static : STATIC_URL,
					title: PROJ_TITLE,
					loggedIn: req.user,
					result : _body.result
				});
			}else{
				console.error(err);
				throw new Error(err);
			}
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});

/**
 * 진행중인 혹은 진행이 되기 전 이벤트에 대한 정보 페이지
 */
router.get('/event/:ref_id/information', (req, res) => {
	'use strict';

	async.parallel(
		[
			(cb) => {
				request.get(`${HOST}/event/vote/question/${req.params.ref_id}`, (err, response, body) => {
					if(!err && response.statusCode == 200){
						let _body = JSON.parse(body);
						if(_body.success){
							cb(null, _body);
						}else{
							console.error('[vote | question] success status is false');
							cb(null, null);
						}
					}else{
						cb(err, null);
						console.error(err);
					}
				});
			},
			(cb) => {
				request.get(`${HOST}/event/vote/answer/${req.params.ref_id}`, (err, response, body) => {
					if(!err && response.statusCode == 200){
						let _body = JSON.parse(body);
						if(_body.success){
							cb(null, _body);
						}else{
							console.error('[vote | answer] success status is false');
							cb(null, null);
						}
					}else{
						cb(err, null);
						console.error(err);
					}
				});
			}
		],
		(err, result) => {
			if (!err) {
				res.render('event_details', {
					current_path: 'EVENT',
					static : STATIC_URL,
					title: PROJ_TITLE,
					loggedIn: req.user,
					question : result[0].result,
					answer : result[1].result
				});
			} else {
				console.error(err);
				throw new Error(err);
			}
		});
});



// router.get('/test', (req, res) => {
// 	res.json({result: 'Hello World'});
// });


// TEST CSRF token
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({extended:false});
// todo app.js에서 사용하고 있는 global에 바인딩된 것은 왜 사용하지 못하지?


router.get('/test/form', csrfProtection, (req, res) => {
	res.render('form', {
		title : PROJ_TITLE
		,csrfToken : req.csrfToken()
		// test : mysql_location // this is working!!
	});
});

// router.post('/test/form/submit', parseForm, csrfProtection, (req, res) => {
// 	res.send('data is being processed');
// });

module.exports = router;