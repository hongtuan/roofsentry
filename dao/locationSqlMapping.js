//customer_tb sqls:
var location = {
	insert:'INSERT INTO location_tb(cid,lname,lcpos,sencount,dataurl,dataurlb1,dataurlb2,locdefine) VALUES(?,?,?,?,?,?,?,?)',
	update:'update location set cid=?,lname=?,lcpos=?,sencount=?,dataurl=?,dataurlb1=?,dataurlb2=?,locdefine=? where lid=?',
	delete: 'delete from location_tb where lid=?',
	queryById: 'select * from location_tb where lid=?',
	queryAll: 'select * from location_tb'
};

module.exports = location;
