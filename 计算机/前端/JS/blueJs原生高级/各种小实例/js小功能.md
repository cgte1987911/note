##### 1. 内置类型判断
```js
Object.prototype.toString.call(date).
substring(8,Object.prototype.toString.call(date).length-1) 
```
##### 2. 原生实现map
```js
    Array.prototype.map=function(fn){
    var result=[];
    for(var i=0;i<this.length;i++)
        result.push(fn(this[i],i));

    return result
  }
    var arr=[1,20,30];
    var res=arr.map(function(item,i){
      return item*2;
    })
 
    alert(res)
```

##### 3. 原生实现reduce
```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <script>
    Array.prototype.reduce=Array.prototype.reduce||function (cb, initialValue){
      var start=0;
      if(typeof initialValue=='undefined'){
        initialValue=this[0];
        start=1;
      }

      for(start;start<this.length;start++){
        initialValue=cb(initialValue, this[start], start);
      }

      return initialValue;
    };


    let arr=[12, 5, 7, 9];
    let sum=arr.reduce(function (tmp, item, index){
      return tmp+item;
    }, 99);

    console.log(sum);
    </script>
  </body>
</html>

```

##### 4. 原生实现bind

```html
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<script>
	Function.prototype.customBind=function(thisArg,...list){
		let self=this;
		function Bound(...arg2){
			let thisArgSelf=this instanceof Bound ?this:thisArg;
			self.apply(thisArgSelf,[...list,...arg2]);
		}
		Bound.prototype=Object.create(self.prototype);
		Bound.prototype.constructor=self;
		return Bound;
	}
	function func(...arg){
		console.log(this);
		console.log(arg);

	}
	func.prototype.miaov=function(){
		console.log(123)
	}
	let newFunc=func.bind([1,2,3],1,2,3,4,5);
	let newFunc2=func.customBind({a:1},1,2,3,4)
	newFunc2(5,6,7,8);
	var f2=new newFunc2();
	f2.miaov();
</script>
<body>
	
</body>
</html>
```

##### 5. 复合函数概念示例
```js
function add(x, y) {
  return x + y;
}

function square(z) {
  return z * z;
}
function double(x) {
  return x * 2;
}
 复合函数
 function compose(mids) {
   return mids.reduce((leftFn, rightFn) => (...args) =>
     rightFn(leftFn(...args))
   );
 }

 const ret = square(add(1,2))
 console.log(ret)

 const middwares = [add, square, double];
 let retFn = compose(middwares)
 console.log(retFn(1,2)) // 18


---------------------------------------------------------------------------


function compose(middlewares) {
    return function() {
      return dispatch(0);
      // 执行第0个
      function dispatch(i) {
        let fn = middlewares[i];
        if (!fn) {
          return Promise.resolve();
        }
        return Promise.resolve(
          fn(function next() {
            // promise完成后，再执行下一个
            return dispatch(i + 1);
          })
        );
      }
    };
  }


//   fn1
//   fn2 2s
//   delay
//   fn3
//   end fn2
//   end fn1


  async function fn1(next) {
    console.log("fn1");
    await next();
    console.log("end fn1");
  }
  
  async function fn2(next) {
    console.log("fn2");
    await delay();
    await next();
    console.log("end fn2");
  }
  
  function fn3(next) {
    console.log("fn3");
  }
  
  function delay() {
    return new Promise((reslove, reject) => {
      setTimeout(() => {
        console.log("delay");
        reslove();
      }, 2000);
    });
  }
  
  const middlewares = [fn1, fn2, fn3];
  const finalFn = compose(middlewares);
  finalFn(); // ?
```
##### 6. 给对象方法起别名，导致this失效的解决思路（以给document.getElementById起简短的别名为例）
```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<script>
document.getElementById=(function(func){
	return function(){
		return func.apply(document,arguments)
	}
})(document.getElementById)

var getId=document.getElementById
window.onload=function(){
	var oDiv=getId('div1')
	console.log(oDiv.innerHTML)
}

</script>
</head>

<body>
	<div id="div1">111222</div>
</body>
</html>
```
