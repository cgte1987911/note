```js
const http=require('http');

let server=http.createServer((request, response)=>{
  response.write('dsfasdfasdfads');
  response.end();
});
server.listen(8080);

```

```js
const fs=require('fs');

fs.readFile('data/1.txt', function (err, buffer){
  if(err){
    console.log('错了', err);
  }else{
    console.log(buffer.toString());
  }
});

```

```js
const qs=require('querystring');

let res=qs.parse('a=12&name=blue&id=56');

console.log(res);

```

```js
const crypto=require('crypto');

let obj=crypto.createHash('md5');

obj.update('123456');

let res=obj.digest('hex');

console.log(res);

```

