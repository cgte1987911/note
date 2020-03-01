const path=require('path')


module.exports={
    port:8080,

    db_host:'localhost',
    db_port:3306,
    db_user:'root',
    db_pass:'123456',
    db_name:'z_blue_cars',

    redis_host:'localhost',
    redis_port:6379,
    redis_pass:undefined,


    upload_dir:path.resolve(__dirname,'../upload'),


    //session
    max_age:86400*1000,

    //key
    key_count:1024,
    key_path:path.resolve(__dirname,'../.keys'),
    key_len:1024,

    //static
    static_path:path.resolve(__dirname,'../static'),

    //errors
    errors_404:path.resolve(__dirname,'../errors/404.html'),
    errors_500:path.resolve(__dirname,'../errors/500.html'),

    //md5
    md5_key:'dsgfcb,lgkfo44$fdgfhfhjfgfsrergdh'
}