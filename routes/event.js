/**
 * Created by cheese on 2017. 2. 2..
 */

const express = require('express');
const router = express.Router();




router.get('/result', (req, res)=>{
    console.log('asdasdasdasd');
    res.json({result: 'Hello World'});
});
module.exports = router;