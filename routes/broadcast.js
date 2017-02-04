const
	express = require('express'),
	router = express.Router();


router.get('/calendar', (req, res)=>{
	res.render('bc_calendar',{
		current_path: 'bc_calendar',
		title: PROJ_TITLE + 'login'
	});
});


router.get('/live', (req, res)=>{
	res.render('bc_live',{
		current_path: 'bc_live',
		title: PROJ_TITLE + 'login'
	});
});


module.exports = router;