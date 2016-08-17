//customers
var express = require('express');
var router = express.Router();
//var dateFormat = require('dateformat');

var $sql = require('../dao/customerSqlMapping');

/* GET customer listing. */
router.get('/', function(req, res, next) {
  req.getConnection(function(err,conn){
    if (err) return next("Cannot Connect");
      var query = conn.query($sql.queryAll,function(err,rows){
        if(err){
          console.log(err);
          return next("Mysql error, check your query");
        }
        res.render('customer_list',{title:"Current Coustomers list.",rows:rows});
      });
    });
});

router.get('/addCustomer', function(req, res, next) {
	//customerDao.add(req, res, next);
	res.render('add_customer');
});

module.exports = router;
