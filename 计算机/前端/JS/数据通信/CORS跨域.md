### 1.CORS跨域

前端代码：

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <script>
    let xhr=new XMLHttpRequest();

    xhr.open('post', 'http://localhost:8080/api');
    xhr.setRequestHeader('token', 'dasdfasfdfrtt35t');
    xhr.setRequestHeader('a', '12');
    xhr.send();

    xhr.onload=function (){
      console.log(xhr.responseText);
    };
    </script>
  </body>
</html>

```

后端代码：

```js
const Koa=require('koa');
const Router=require('koa-router');

let app=new Koa();

let router=new Router();

//
router.options('/api', async ctx=>{
  // if(ctx.get('origin')=='taobao.com')
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', '*');
  ctx.set('Access-Control-Allow-Methods', '*');
  ctx.body='ok';
});

router.post('/api', async ctx=>{
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', '*');
  ctx.set('Access-Control-Allow-Methods', '*');

  ctx.body='adfasdfertedgsdhfg';
});


app.use(router.routes());
app.listen(8080);

```

