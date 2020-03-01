const koa=require('koa');
const static=require('koa-static')
var server=new koa();
function rnd(n,m){
    return Math.floor(Math.random()*(m-n)+n)
}
server.use(function*(next){
    if(this.req.url.indexOf('/chouJ')!=-1){
        var n=Math.random();
        if(n<0.01){
            this.body='1'
        }else if(n<0.025){
            this.body='2'
        }else if(n<0.045){
            this.body='3';
        }else{
            this.body='0';
        }
        
        
    }else{
        yield next;
    }
}) 
server.use(static('./www'));
server.listen(8080);