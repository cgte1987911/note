const mysql=require('../libs/mysql')
const password=require('../libs/password');
const rl=require('../libs/rl');

(async ()=>{
    let db=await mysql;

    while(true){

        let name=await rl.questionAsync('admin username: ')
        name=name.toLowerCase()
        if(!name)
            break;
    
        let rows=await db.query('select * from admin_table where username=?',[name])
    
        if(rows.length>0){
            console.log(`管理员账户已经存在：${name}`)
        }else{
            let pass=await rl.questionAsync('admin password: ')
            await db.query('insert into admin_table (username,password) value(?,?)',[name,password(pass)])
            console.log('管理员账户添加成功')
        }
    }
    rl.close();
})()