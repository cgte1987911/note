1.连接mysql数据库

```js
const mysql=require('promise-mysql');

(async ()=>{
  let db=await mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'test_db'});
  await db.query("DELETE FROM user_table WHERE ID=?", [8]);
  let data=await db.query('SELECT * FROM user_table', []);

  console.log(data);
})();
```

