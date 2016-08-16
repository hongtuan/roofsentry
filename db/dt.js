// JavaScript File
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'hongtuan',
  password : 'c9',
  database : 'rsdb'
});

connection.connect();

connection.query('SELECT * from customer_tb', function(err, rows, fields) {
  if (!err){
    console.log('rows.length=', rows.length);
    //console.log('rows:', rows);
    //console.log('fields:', fields);
    //cvr rows to object array
    var ra = [];
    for(var i=0;i<rows.length;i++){
      console.log(rows[i]);
    }
  } else{
    console.log('Error while performing Query.');
  }
});

connection.end();
