const Koa = require('koa')
const config = require('./config')
const opn = require('opn')
const network = require('./libs/network')
const Router = require('koa-router')
const static=require('koa-static')
const {post,upload}=require('./libs/body')
const fs=require('promise-fs')
const ejs=require('koa-ejs')
const path=require('path')



let server = new Koa();



(async () => {

    server.context.db = await require('./libs/mysql')
    server.context.redis = require('./libs/redis');

    let error_404=''
    try{
        error_404=await fs.readFile(config.errors_404)
        error_404=error_404.toString();

    }catch(e){
        console.log('read 404 file error')
    }


    let error_500=''

    try{
        error_500=await fs.readFile(config.errors_500)
        error_500=error_500.toString();
    }catch(e){
        console.log('read 505 file error')
    }

    server.use(async (ctx, next) => {
        try {
            await next();
            if(!ctx.body){
                ctx.status=404;
                ctx.body=error_404||'NOt Found'
            }
        } catch (e) {
            console.error(e)

            ctx.status = 500;
            ctx.body = error_500||'Internal Server Errors '
        }
    })

    let router = new Router();

/*     router.post('/api',post(), async ctx => {
        if(ctx.url=='favicon.icon') return 
        console.log(ctx.request.fields);
    }) 

    router.post('/upload', ...upload({
        sizeExceed: async (ctx)=>{
            ctx.body="aaa"
        },
        error:async (ctx,e)=>{
            ctx.body='error'
        }
    }), async ctx => {
        ctx.body = div.txt
    }) */

    await require('./libs/session')(server)
/* 
    server.use(async ctx=>{

        if(ctx.session.view){
            ctx.session.view++
        }else{

            ctx.session.view=1
        }

        ctx.body=`第${ctx.session.view}次访问本站`
    }) */


    network.forEach(ip => {
        if (config.port == 80) {
            console.log(`server running at http://${ip}`);
        } else {
            console.log(`server running at http://${ip}:${config.port}`)
        }
    })

    server.use(require('./router'))

    ejs(server,{
        root:path.resolve(__dirname,'template'),
        layout:false,
        viewExt:'ejs',
        cache:false,
        debug:false
    })

    server.listen(config.port)
    console.log(`server running at ${config.port}`)

    //opn(`http://localhost:${config.port}`)
})()



