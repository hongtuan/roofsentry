// JavaScript File
// customerDao

var mysql = require('mysql');
var $conf = require('../conf/dbinfo');
var $util = require('../util/util');
var $sql = require('./customerSqlMapping');

// use db pool
var pool  = mysql.createPool($util.extend({}, $conf.mysql));

// send json to front
var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: 'faild'
		});
	} else {
		res.json(ret);
	}
};
 
module.exports = {
	add: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			// get param from page
			var param = req.query || req.params;
			// setup connect,insert data to table
			// 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
			connection.query($sql.insert, [param.name, param.age], function(err, result) {
				if(result) {
					result = {
						code: 200,
						msg:'add ok'
					};    
				}
 				// send json to page
				jsonWrite(res, result);
				// release db connect
				connection.release();
			});
		});
	},
	queryAll: function (req, res, next) {
		//*
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryAll, function(err, result) {
				//jsonWrite(res, result);
				res.locals.len = result.length;
				res.locals.rows = result;
				console.log(result);
				console.log('result.length='+result.length);
				console.log('res.locals.rows.length='+res.locals.rows.length);
				connection.release();
				//return result;
			});
		});//*/
		//var conn = pool.getConnection();
		/*/var result = conn.query($sql.queryAll);
		conn.query($sql.queryAll,function(err, result){
			console.log('cb:result.length='+result.length);
		});//*/
		//console.log('result.length='+result.length);
		console.log('queryAll called.');
	}
};
