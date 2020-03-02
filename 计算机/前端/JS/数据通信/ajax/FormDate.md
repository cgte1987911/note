### FormDate的使用

服务端代码：

```js
const Koa=require('koa');
const Router=require('koa-router');
const body=require('koa-better-body');

const static=require('koa-static');

let app=new Koa();

app.use(body({
  uploadDir: './upload'
}));

let router=new Router();


router.post('/upload', async ctx=>{
  console.log(ctx.request.files);

  ctx.body='ok';
});


app.use(router.routes());
app.use(static('./static'));
app.listen(8080);

```

FormData使用实例1：

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <input type="file" id="file1" multiple>
    <button type="button" id="btn1">上传</button>
    <script>
    let btn1=document.getElementById('btn1');
    let file1=document.getElementById('file1');

    btn1.onclick=function (){
      if(file1.files.length==0){
        alert('请先选择文件');
      }else{
        //容器
        let form=new FormData();
        form.append('user', 'blue');
        Array.from(file1.files).forEach(file=>{
          form.append('f', file);
        });

        //xhr、fetch
        let xhr=new XMLHttpRequest();
        xhr.open('post', '/upload');
        xhr.send(form);

        xhr.onload=function (){
          alert(xhr.responseText);
        };
      }
    };
    </script>
  </body>
</html>

```

FormData使用实例2：

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <form id="form1">
      <input type="file" id="file1" name="file" multiple>
    </form>
    <button type="button" id="btn1">上传</button>

    <script>
    let btn1=document.getElementById('btn1');
    let file1=document.getElementById('file1');

    btn1.onclick=function (){
      if(file1.files.length==0){
        alert('请先选择文件');
      }else{
        //容器
        let form=new FormData(document.getElementById('form1'));

        //xhr、fetch
        let xhr=new XMLHttpRequest();
        xhr.open('post', '/upload');
        xhr.send(form);

        xhr.onload=function (){
          alert(xhr.responseText);
        };
      }
    };
    </script>
  </body>
</html>

```

FormData使用实例3：
```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <style media="screen">
    .progress-bar {width:600px;height:20px;background:#CCC;}
    .box {width:0;height:100%;background:#999;}
    </style>
  </head>
  <body>
    <form id="form1">
      <input type="file" id="file1" name="file" multiple>
    </form>
    <button type="button" id="btn1">上传</button>
    <div class="progress-bar">
      <div class="box"></div>
    </div>

    <script>
    let btn1=document.getElementById('btn1');
    let file1=document.getElementById('file1');

    btn1.onclick=function (){
      if(file1.files.length==0){
        alert('请先选择文件');
      }else{
        //容器
        let form=new FormData(document.getElementById('form1'));

        //xhr、fetch
        let xhr=new XMLHttpRequest();

        if(xhr.upload){
          //进度监控
          xhr.upload.onprogress=function (ev){
            console.log('upload', ev.loaded, ev.total);

            document.querySelector('.box').style.width=Math.round(100*ev.loaded/ev.total)+'%';
          };
          xhr.onprogress=function (ev){
            console.log('download', ev.loaded, ev.total);
          };
        }

        xhr.open('post', '/upload');
        xhr.send(form);



        xhr.onload=function (){
          alert(xhr.responseText);
        };
      }
    };
    </script>
  </body>
</html>

```





