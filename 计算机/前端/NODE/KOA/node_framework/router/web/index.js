const Router = require('koa-router')
const static = require('../../libs/contentStatic')

let router = new Router();


router.get('/',
    static('page:',1000)
    , async ctx => {
        ctx.body = '首页3'
    })

module.exports = router.routes();