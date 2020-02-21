### 1. let具有块级作用域

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script>
    {
      let a=12;
    }

    alert(a);//访问不到a
    </script>
  </head>
  <body>
  </body>
</html>
```



### 2.解构赋值

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script>
    //以下都是错误的解构赋值方式
    let {a,b}={12,5};    
    let {a,b};          
    {a,b}={a: 12, b: 5};

    //以下是正确的方式    
    let {a,b}={a: 12, b: 5, c: 88};
    let [a,b]=[5,8];
    </script>
  </head>
  <body>

  </body>
</html>

```



### 3.Array新增的一些方法

map()方法

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script>
    let arr=[68, 53, 12, 98, 65];

    /*let arr2=arr.map(function (item){
      if(item>=60){
        return '及格';
      }else{
        return '不及格';
      }
    });*/
    /*let arr2=arr.map(function (item){
      return item>=60?'及格':'不及格';
    });*/
    let arr2=arr.map(item=>item>=60?'及格':'不及格');

    console.log(arr);
    console.log(arr2);
    </script>
  </head>
  <body>

  </body>
</html>

```

reduce()方法

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script>
    let arr=[68, 53, 12, 98, 65];

    第一次循环tmp的值是68，item的值是53
    let result=arr.reduce(function (tmp, item, index){
      //alert(index+': '+tmp+', '+item);

      return tmp+item;
    });

    alert(result);
    </script>
  </head>
  <body>

  </body>
</html>

```

filter()函数

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script>
    let arr=[68, 53, 12, 98, 65, 83, 16];

     写法一：
    /*let arr2=arr.filter(item=>{
      if(item%2==1){
        return false;
      }else{
        return true;
      }
    });*/
     
     写法二：
    let arr2=arr.filter(item=>item%2==0);

    console.log(arr);
    console.log(arr2);
    </script>
  </head>
  <body>

  </body>
</html>

```

forEach()函数

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script>
    let arr=[68, 53, 12, 98, 65, 83, 16];

    arr.forEach((item,index)=>{
      //alert('第'+index+'个: '+item);
      alert(`第${index}个：${item}`);
    });
    </script>
  </head>
  <body>

  </body>
</html>

```



### 4.JSON对象使用

JSON.stringify({a: 12, b: 5})     => '{"a": 12, "b": 5}'
JSON.parse('{"a": 12, "b": 5}')   => {a: 12, b: 5}



### 5.es7的新特性

幂操作

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script>
    //alert(Math.pow(3, 5));
    alert(3**5);
    </script>
  </head>
  <body>

  </body>
</html>
```

Array的include()函数

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script>
    let arr=[12,8,9,37,26];

    //alert(arr.indexOf(8)!=-1);
    alert(arr.includes(8));
    </script>
  </head>
  <body>

  </body>
</html>
```

