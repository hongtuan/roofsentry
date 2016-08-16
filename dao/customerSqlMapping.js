//customer_tb sqls:
var customer = {
	insert:'INSERT INTO customer_tb(cname,email,telnum,manager) VALUES(?,?,?,?)',
	update:'update customer_tb set cname=?, email=?,telnum=?,manager=? where cid=?',
	delete: 'delete from customer_tb where cid=?',
	queryById: 'select * from customer_tb where cid=?',
	queryAll: 'select * from customer_tb'
};

module.exports = customer;

