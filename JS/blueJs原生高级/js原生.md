### 1.类型判断

**typeof**   只能检测基本类型（如[1,2,3],{a:1,b:2}都检测为object）

**instanceof**       检测是不是类的实例（不光检测自己类型还检测父级类型）

**constructor**     返回实例构造器

							精确类型判断（只包括子级，不包括父级）

```js
let oDiv=document.getElementById('div1')
alert(oDiv.constructor==HTMLDivElement);//检测是否是div
alert(oDiv instanceof HTMLDivElement)
```

##### 内置类型判断

```js
Object.prototype.toString.call(date).
substring(8,Object.prototype.toString.call(date).length-1) 
```



### 2.this问题

**this指向在定时器或者事件里的问题解决方案**

	箭头函数内部的this永远跟箭头函数外部一致
	
	箭头函数相当于自带一个bind(this)

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script>
    class A{
      constructor(){
        this.username='blue';

        // document.onclick=function (){
        //   alert(this.username);
        // }.bind(this);
		//以上是用bind函数解决
        document.onclick=()=>{
          alert(this.username);
        };
        //以上是用箭头函数解决
      }
    }

    let a=new A();
    </script>
  </head>
  <body>

  </body>
</html>
```

this在json函数里的小实例
```js
var o = {show:function(a){a()}}
var s = {show:function(a){alert(this)}};
s.show()//[object Object]
o.show(s.show)//[object Window]
```