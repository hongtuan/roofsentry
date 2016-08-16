//customers
var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
var customerDao = require('../dao/customerDao');
/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('customer CRDU here.');
  //query db first
  customerDao.queryAll(req, res, next);
  res.render('customer_list', { rows: res.data,len:2,
    stime:dateFormat(Date.now(), "yyyy-mm-dd hh:MM:ss")});
});
router.get('/addCustomer', function(req, res, next) {
	customerDao.add(req, res, next);
});

module.exports = router;
