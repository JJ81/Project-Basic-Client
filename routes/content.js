const express = require('express');
const router = express.Router();




router.get('/', (req, res)=>{
    res.render('content', {
        current_path: 'content',
        title: PROJ_TITLE + '이벤트',
        // result: result
    });
    
});
module.exports = router;