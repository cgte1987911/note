var svgCaptcha = require('svg-captcha');
const express=require('express')
const cookieSession=require('cookie-session');

var server=express();
  (function (){
  var keys=[];
  for(var i=0;i<100000;i++){
    keys[i]='a_'+Math.random();
  }
  server.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 20*60*1000  //20min
  }));
})();
server.get('/captcha', function (req, res) {
	var captcha = svgCaptcha.create({size:10,noise: 6});
	req.session.captcha = captcha.text;
	
	res.type('svg'); // 使用ejs等模板时如果报错 res.type('html')
	res.status(200).send(captcha.data);
});

server.listen(8080);