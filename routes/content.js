const
    express = require('express'),
    router = express.Router(),
    Content = require('../service/ContentService');


router.get('/', (req, res)=>{
    Content.getList((err, result)=>{
        if (!err){
            res.render('content', {
                current_path: 'content',
                title: PROJ_TITLE + '이벤트',
                result: result
            });
        }else{
            res.status(500).send({ error: err});
        }
    });
});
module.exports = router;