const Router = require('koa-router')
const { post, upload } = require('../../libs/body')
const path = require('path')
const fs = require('promise-fs')
const config = require('../../config')
const regs = require("../../libs/regs")

let router = new Router();

router.use(async (ctx, next) => {
    if (!ctx.session['adminID'] && ctx.url != '/admin/login') {
        ctx.redirect('/admin/login')
    } else {
        await next();
    }
})

router.get('/', async ctx => {
    ctx.body = 'admin';
})

require('./login')(router, post)


addRouter('banner', [
    { reg: regs.admin.title, name: 'title', msg: '标题有误' },
    { reg: regs.admin.title, name: 'sub_title', msg: '副标题有误' },
    { reg: regs.admin.images, name: 'images', msg: '请上传指定格式的图片' }
],
    async fields => {
        let { images } = fields
        let str=''
        images.forEach((item,index)=>{
            let oldName=path.basename(item.path)
            let newName=path.basename(item.path)+path.parse(item.name).ext
            fs.rename(config.upload_dir+'\\'+oldName,config.upload_dir+'\\'+newName)
            
            if(item.size!==0){
                str += newName+',';
            }
        })
        fields.images=str
        return fields
    }
)



function addRouter(name, valids, process) {
    router.get(`/${name}`, async ctx => {
        let datas = await ctx.db.query(`select * from ${name}_table order by id desc`)
        await ctx.render(`admin/table`, { datas })
    })
    router.post(`/${name}`, ...upload({
        maxFileSize: 500 * 1024 * 1024
    }), async ctx => {
        let fields = await process(ctx.request.fields)


        let errors = [];
        valids.forEach(({ name, reg, msg }) => {
            if (!reg.test(ctx.request.fields[name])) {
                errors.push(msg);
            }
        })

        if (!errors.length) {
            let arr_field = [];
            let arr_value = []
            for (let name in fields) {
                if(name!='aSize0FileName'){
                    arr_field.push(name)
                    arr_value.push(fields[name])
                }
            }
            try {
                await ctx.db.query(`insert into ${name}_table(${arr_field.join(',')}) values (${arr_value.map(a => '?').join(',')})`, arr_value)
                ctx.redirect(`/admin/${name}`)
            } catch (e) {
                let images=fields.images.split(',')
                for(let i=0;i<images.length;i++){
                    let res = await fs.unlink(config.upload_dir + '/' + images[i])
                }
            } 
        } else {
            ctx.body = errors.join(', ')
        }
    })

    router.post(`/${name}/:id`, async ctx => {
    })

    router.get(`/del${name}/:id`, async ctx => {
    })
}





router.get('/car', async ctx => {
    ctx.body = 'car';
})


module.exports = router.routes();