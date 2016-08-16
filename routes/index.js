var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Roof Position Define.',
    stime:dateFormat(Date.now(), "yyyy-mm-dd hh:MM:ss")});
});

module.exports = router;
