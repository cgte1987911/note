const passwordLib=require('../../libs/password')
const {admin}=require('../../libs/regs')

module.exports=function(router,post){
    router.get('/login',async (ctx)=>{
        await ctx.render('admin/login',{error:null,username:'',password:''});
    })
    
    router.post('/login',post(),async ctx=>{
        let {username,password}=ctx.request.fields;
        username=username.toLowerCase();
    
        async function render(msg){
            await ctx.render('admin/login',{error:msg,username,password})
        }
    
        if(!admin.username.test(username)){
            await render('用户名格式不对，需要4-32个数字、字母')
        }else if(!admin.password.test(password)){
            await render('密码格式错误,需要6-32个任意字符')
        }else{
            password=password.toLowerCase();
    
            let rows=await ctx.db.query('select id,password from admin_table where username=?',[username])
            if(rows.length==0){
                await render('此用户不存在')
            }else{
                if(rows[0].password==passwordLib(password)){
                    ctx.session['adminID']=rows[0].id;
                    ctx.redirect('/admin');
                }else{
                    await render('用户名或者密码错误')
                }
            }
        }
    })
}

