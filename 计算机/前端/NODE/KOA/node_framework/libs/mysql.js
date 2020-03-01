const mysql =require('promise-mysql')
config=require('../config')

module.exports=mysql.createPool({
    host: config.db_host,
    port: config.db_port,
    user: config.db_user,
    password: config.db_pass,
    database: config.db_name
});