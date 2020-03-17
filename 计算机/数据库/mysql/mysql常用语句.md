### 一、增删改查示例

```sql
    insert into user_table (name,password,age,score) values('张三',"123321",54,5)
    delete from user_table where age=54
    update user_table set password='1234567890123',age=18 where name='ltf'  
    //一定要有where 条件否则所有语句都会被修改
    
```

```sql
SELECT_ROLE_BY_USERID = \
  select role.* from role \
  left join user_role on (role.id = user_role.role_id) \
  where user_role.user_id = ?

SELECT_PERMISSION_BY_USERID = \
  select permission.* from permission \
  left join role_permission on (permission.id = role_permission.permission_id) \
  left join user_role on (role_permission.role_id = user_role.role_id) \
  where user_role.user_id = ?
```



### 二、赋予用户权限

* `grant all on *.* to 'ltf'@'%' identified by '654321' WITH GRANT OPTION`

* 如果用户远程访问不成功就关闭防火墙：`service firewalld stop`

* ```sql
  GRANT SELECT,INSERT ON meituan.banner_table TO 'blue'@'192.168.183.1' IDENTIFIED BY '654321';
  GRANT ALL ON meituan.banner_table TO 'blue'@'%' IDENTIFIED BY '654321' WITH GRANT OPTION;
  ```

* `flush privileges;`



### 三、备份  mysqldump

* mysqldump 表名 -u用户 -p

* mysqldump --all-databases -uroot -p

* 用crontab备份

  * crontab格式： * * * * * 脚本地址      分钟、小时、日、月、星期

  * 30 * * * *  /root/a.sh    每个小时的30分执行——00:30, 01:30, ... 23:30

  * */2 * * * *              每隔两分钟执行一次

  * \*  \*1 * * *               每个月的1号

  * \* \*3-8 5 *               5月份的3到8号

  * 定时备份meituan数据库

    * `mkidr /mysql_bak`

    * `vim mysql_bak.sh`

      ```bash
      d=`date+"%Y%m%d%H%M"`
      sql_name=/mysql_bak/meituan$d.sql
      
      mysqldump -uroot meituan > $sql_name
      gzip $sql_name
      scp $sql_name.gz root@192.168.117.131:/root/
      ```

    * chmod  +x  mysql_bak.sh

    * crontab -e

      ```bash
      */1 * * * * mysql_bak.sh
      ```

  * 恢复meituan数据库

    * mysqldump meituan -uroot >./a.txt
    * `drop database meituan`
    * create database meituan
    * mysql -uroot meituan >a.sql



### 四、事务处理

1. node示例

   ```js
   const mysql=require('promise-mysql');
   
   (async ()=>{
     //1.连接数据库
     let db=await mysql.createPool({
       host: 'localhost',
       user: 'root',
       password: '123456',
       database: 'meituan'
     });
   
     //2.启动事务
     await db.query('SET autocommit=0;');
     await db.query('START TRANSACTION;');
   
     //3.操作
     try{
       await db.query('UPDATE banner_table SET title=? WHERE ID=?', ['12', '396da7aa468c48fe98d44f30115b042f']);
       await db.query('UPDATE banner_tble SET title=? WHERE ID=?', ['15', '396da7aa468c48fe98d44f30115b042f']);
   
       await db.query('COMMIT;');
     }catch(e){
       await db.query('ROLLBACK;');
     }
   
     //4.rollback、commit
   
   
     console.log('完成');
   })();
   
   ```

   







  









