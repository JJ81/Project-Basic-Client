/**
 * Created by cheese on 2017. 2. 2..
 */

const express = require('express');
const router = express.Router();



router.get('/', (req, res)=>{
    
    res.render('event',{
        current_path: 'event',
        title: PROJ_TITLE + '이벤트',
    });
    
});

module.exports = router;