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

### 3.高阶类的应用

HOC高阶类：
1.在父类中使用子类才有的东西
2.类写完不直接用——包裹一下

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script src="js/Store.js" charset="utf-8"></script>
    <script src="js/A.js" charset="utf-8"></script>
    <script src="js/B.js" charset="utf-8"></script>
  </head>
  <body>
    <script>
    let a=new A();
    let b=new B();

    b.setA();
    a.getA();
    </script>
  </body>
</html>

```
Store.js文件

```js
class Store{
  constructor(){
    this._state={};
  }

  get(key){
    if(key in this._state){
      return this._state[key];
    }else{
      throw new Error(`${key} is not defined`);
    }
  }

  set(key, val){
    this._state[key]=val;
  }

  connect(cls){
    let store=this;

    return class extends cls{
      constructor(...args){
        super(...args);

        this.get=store.get.bind(store);
        this.set=store.set.bind(store);
        
        // this.get=store.get;
        // this.set=store.set;
      }
    }
  }
}

let store=new Store();
```
A.js文件
```js
const A=store.connect(class {
  constructor(){

  }

  getA(){
    console.log(this.get('a'));
  }
});
```
B.js文件
```js
const B=store.connect(class {
  constructor(){

  }

  setA(){
    this.set('a', 12);
  }
});

```


### 4.可响应对象的3种方式

访问器方式
```js
    class A{
      constructor(){
        this._count=12;
      }

      get count(){
        return this._count;
      }
      set count(val){
        if(typeof val!='number'){
          throw new Error('count must be a number');
        }

        this._count=val;
      }
    }

    let a=new A();

    console.log(a.count);
```

defineProperty方式
```js
    class App{
      constructor(options){
        let data=options.data();

        for(let name in data){
          Object.defineProperty(this, name, {
            configurable: true,
            get(){
              return data[name];
            },
            set(val){
              data[name]=val;

              this.render();
            }
          });
        }

        this._updated=false;
      }

      //this.arr, 1, 55
      $set(obj, key, val){
        this._updated=false;
        obj[key]=val;

        if(this._updated==false){
          this.render();
        }
      }

      render(){
        console.log('render');
        this._updated=true;
      }
    }

    let app=new App({
      root: '#div1',
      data(){
        return {
          a: 12,
          b: 5,
          name: 'blue',
          arr: [1,2,3],
          data: {
            a: 12,
            b: 5
          }
        }
      }
    });
```

Proxy方式
	Proxy基本使用
```js
 let _data={
      a: 12,
      arr: [1,2,3],
      json: {a: 12, b: 5}
    };

    let p=new Proxy(_data, {
      has(data, name){    //in
        if(name in data){
          return true;
        }else{
          return false;
        }
      },
      get(data, name){  //获取
        if(name in data){
          return data[name];
        }else{
          throw new Error(`${name} is not defined`);
        }
      },
      set(data, name, val){    //设置
        console.log('set');
        data[name]=val;
      },
      deleteProperty(data, name){   //处理delete
        if(name in data){
          return delete data[name];
        }else{
          throw new Error(`${name} is not defined`);
        }
      }
    });
```
Proxy和函数配合
```js
    let _data=function (a, b, c){
      console.log(a+b+c);
    };

    let p=new Proxy(_data, {
      apply(fn, thisValue, args){
        if(args.length!=3){
          throw new Error('argument length must be 3');
        }else{
          fn(...args);
        }
      }
    });

    p(23,5,6);
```
Proxy和类配合
```js
    class A{
      render(){
        console.log('渲染');
      }
    }

    let a=new Proxy(new A(), {
      set(obj, name, val){
        obj[name]=val;

        obj.render();
      }
    });

    a.name='blue';
```

```js
    let A=new Proxy(class {
      render(){
        console.log('渲染');
      }
    }, {
      construct(cls, args){
        let obj=new cls();

        return new Proxy(obj, {
          set(data, name, val){
            data[name]=val;

            obj.render();
          }
        });
      }
    });

    let a=new A();
```

### 5.DOM节点

1. 父节点——parentNode  

2. 子节点   
	
	children——只有元素节点  
	childNodes——所有节点=元素+文本+注释+...       

节点类型 .nodeType
数字   
   1 document.ELEMENT_NODE  
   3 document.TEXT_NODE  
   8 document.COMMENT_NODE  
   9 document.DOCUMENT_NODE  

document是html元素的父级

--------------------------------------------------------------------------------

兄弟节点
1. previousSibling  
   需要处理兼容——需要elementNode  

2. nextSibling  

--------------------------------------------------------------------------------

DOM操作：  
1.创建  
  创建元素  
  document.createElement('button')    

  创建文本节点  
  document.createTextNode('gfdhfghjkh');  

  创建注释节点  
  document.createComment('hdyhdtfhgghjhj');  

  *创建其他标准下的元素  
  document.createElementNS  

2.加入  
  添加到末尾  
  父.appendChild(元素)  

  插入到xxx之前  
  父.insertBefore(元素, 谁的前面)  

3.删除、替换  
  删除  
  父.removeChild(元素)  

  替换  
  父.replaceChild(元素, 替换谁)  

--------------------------------------------------------------------------------

文档碎片——  
1.不会多出一层  
2.性能比较高——所有的更新、重排一次搞定  

文档碎片示例：  

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="div1">

    </div>
    <script>
    let root=document.getElementById('div1');

    let frag=document.createDocumentFragment();
    let h2=document.createElement('h2');
    h2.innerHTML='asdfasdewrefhcfghjg';
    frag.appendChild(h2);

    let ul=document.createElement('ul');
    ul.innerHTML='<li>stesdgfgsfdsgfdsg</li><li>stesdgfgsfdsgfdsg</li><li>stesdgfgsfdsgfdsg</li><li>stesdgfgsfdsgfdsg</li>';
    frag.appendChild(ul);


    //1002+1059=1030
    let start=Date.now();
    for(let i=0;i<50000;i++){
      let ele=frag.cloneNode(true);

      root.appendChild(ele);
    }
    alert(Date.now()-start);
    </script>
  </body>
</html>

```

