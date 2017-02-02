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
const HOST = 'http://localhost:3002/'; // todo config 파일로 이동시키고 서버실행시 변경이 될 수 있도록 설정한다.

router.get('/', (req, res) => {
	'use strict';

	async.parallel(
		[
			(cb) => {
				request.get(`${HOST}api/v2/broadcast/live`, (err, res, body) => {
					if(!err && res.statusCode == 200){
						// console.log(typeof body);
						// console.log(body);
						// console.log(body.success);

						let _body = JSON.parse(body);

						if(_body.success){
							cb(null, _body);
						}else{
							console.error('success status is false');
							cb(null, null);
						}
					}else{
						cb(err, null);
						console.error(err);
					}
				});
			}
		], (err, result) => {
		if (!err) {

			console.log('result');
			console.log(result);

			res.render('index', {
				current_path: 'INDEX',
				title: PROJ_TITLE,
				live : result[0].live
				// loggedIn: req.user
				// recomList: result[0],
				// contentlist: result[1]
			});
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

router.get('/test', (req, res) => {
	res.json({result: 'Hello World'});
});


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

router.post('/test/form/submit', parseForm, csrfProtection, (req, res) => {
	res.send('data is being processed');
});

module.exports = router;