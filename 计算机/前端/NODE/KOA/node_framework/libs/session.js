const session=require('koa-session');
const config=require('../config');
const fs=require('promise-fs')
const client=require('../libs/redis');


module.exports=async (server)=>{
    try{
        let buffer=await fs.readFile(config.key_path)
        server.keys=JSON.parse(buffer.toString());
    }catch(e){
        console.log('读取key文件失败，请重新生成')
    }
    let store={
        async get(key,maxAge){
            let data=await client.getAsync(key);
            if(!data) return {};
            try{
                return JSON.parse(data)
            }catch(e){
                return {};
            }
        },
        async set(key,session,maxAge){
                await client.psetexAsync(key,maxAge,JSON.stringify(session))  //psetexasync函数是带有效期并且以毫秒为单位
        },
        async destroy(key){
            await client.delAsync(key)
        }
    }
    server.use(session({
        maxAge:config.max_age,
        renew:true,
        store
    },server))
}