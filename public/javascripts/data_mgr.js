// JavaScript File
//mgr.js
function addCustomer(){
  layer.open({
    type: 2,
    title: 'AddCustomer',
    maxmin: false,
    shadeClose: false, //点击遮罩关闭层
    area : ['600px' , '400px'],
    content: 'addCustomer'
  });
}
