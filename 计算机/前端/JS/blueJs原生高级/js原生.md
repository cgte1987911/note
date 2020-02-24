



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

可响应数组

```html

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="root">
      <!-- 模板元素 -->
      <div class="box">
        <h2>sssss</h2>
        <ul>
          <li>asdfasdf</li>
          <li>rwere</li>
        </ul>
      </div>
    </div>

    <script>
    let arr=new Proxy([12,5,8], {
      set(arr, name, val){
        arr[name]=val;
        render();

        return true;
      }
    });


    //
    let root=document.querySelector('#root');
    let box=document.querySelector('.box');
    let frag=document.createDocumentFragment();
    frag.appendChild(box);

    let timer=null;
    function render(){
      clearTimeout(timer);
      timer=setTimeout(function (){
        // 性能很低
        root.innerHTML='';

        arr.forEach(item=>{
          let el=frag.cloneNode(true);

          el.children[0].getElementsByTagName('h2')[0].innerHTML=item;

          root.appendChild(el);
        });
      }, 0);
    }

    //初始渲染
    render();
    </script>
  </body>
</html>

```

编译和渲染DOM节点

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="root">
      姓名：{{name}}

      <button type="button" @click="add">a+=6</button>

      <input type="text" :value="a">
      <span :title="name"></span>

      <div class="">
        -----------------
      </div>

      {{a+b+json.n}}
    </div>
    <script src="blue.js" charset="utf-8"></script>
  </body>
</html>
```

```js
function assert(exp, msg){
  if(!exp){
    throw new Error(msg);
  }
}

function _getElement(obj){
  assert(obj, 'root is required');

  if(typeof obj=='string'){
    let el=document.querySelector(obj);
    assert(el, `${obj} not found`);
    return el;
  }else if(obj instanceof HTMLElement){
    return obj;
  }else{
    assert(false, 'root is invaild');
  }
}

class Blue{
  constructor(options={}){
    this._root=_getElement(options.root);

    //
    this.timer=0;

    //assert从简
    const _this=this;
    let proxy=new Proxy(options.data(), {
      get(data, name){
        assert(name in data, `data '${name}' is not found`);

        return data[name];
      },
      set(data, name, val){
        data[name]=val;

        _this.update();

        return true;
      }
    });

    this._parent=this._root.parentNode;
    // this._template=document.createDocumentFragment();
    // this._template.appendChild(this._root);
    this._template=this._root.cloneNode(true);

    //保存所有methods
    this._methods=options.methods||{};

    this.update();

    this._data=proxy;
    return proxy;
  }

  update(){
    clearTimeout(this.timer);
    this.timer=setTimeout(()=>{
      this.render();
    }, 0);
  }

  render(){
    console.log('render');

    let root=this._template.cloneNode(true);

    //1.找到所有的模板({{}})
    Array.from(root.childNodes).forEach(child=>{
      if(child.nodeType==document.TEXT_NODE){
        child.data=child.data.replace(/\{\{[^\}]+\}\}/g, (str)=>{
          str=str.substring(2, str.length-2).trim();

          let arr=[];
          for(let key in this._data){
            arr.push(`let ${key}=${JSON.stringify(this._data[key])};`);
          }
          arr.push(str);

          return eval(arr.join(''));
        });
      }
    });

    //2.找到所有的事件
    Array.from(root.children).forEach(child=>{
      Array.from(child.attributes).forEach(attr=>{
        if(attr.name.startsWith('@')){
          let evname=attr.name.substring(1);

          child.addEventListener(evname, ()=>{
            let arr=[];
            for(let key in this._methods){
              arr.push(`let ${key}=this._methods[${JSON.stringify(key)}];`);
            }
            arr.push(attr.value+'.call(this._data)');

            eval(arr.join(''));
          }, false);
        }
      });
    });

    //新的元素换进去
    this._parent.replaceChild(root, this._root);
    this._root=root;
  }
}

let blue=new Blue({
  root: '#root',
  data(){
    return {
      name: 'blue',
      a: 12,
      b: 5,
      c: 99,
      json: {
        n: 99
      }
    }
  },
  methods: {
    add(){
      this.a+=6;
    }
  }
})

```



### 6. js原生事件

1. 阻止冒泡      

   ev.cancelBubble=true   //这是兼容的

   ev.stopPropagation()     //这是不兼容的

2. 阻止默认右键弹出层菜单

   方法一：
   
   ```js
   document.oncontextmenu=function (){
       alert('a');
       return false;//可以用ev.preventDefault();替代
   };
   ```
   
   方法二：
   
```js
   document.addEventListener('contextmenu', function (ev){
         ev.preventDefault();//不能用return false
    }, false);
```

   小实例阻止复制

   ```html
   <!DOCTYPE html>
   <html lang="en" dir="ltr">
     <head>
       <meta charset="utf-8">
       <title></title>
     </head>
     <body>
       asdfasdfasdfasdfsad
       <script>
       document.onkeydown=function (ev){
         if(ev.ctrlKey && ev.keyCode==67){
           alert('本站文章需要加入VIP才能复制');
           ev.preventDefault();
         }
       };
   
       document.oncontextmenu=function (ev){
         ev.preventDefault();
       };
       </script>
     </body>
   </html>
   ```

阻止表单提交默认事件

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <form action="http://www.zhinengshe.com/" method="get">
      <input type="text" name="user">
      <button type="submit" name="button">提交</button>
    </form>
    <script>
    let form=document.querySelector('form');

    form.onsubmit=function (ev){
      ev.preventDefault();

      alert('ajax');
    };
    </script>
  </body>
</html>

```

ev.target是当前触发事件的对象

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <button type="button" id="btn1">按钮</button>
    <script>
    let btn=document.getElementById('btn1');

    btn.onclick=function (ev){
      alert(ev.target==this);
    };
    </script>
  </body>
</html>
```

鼠标事件  

clientX/Y    到可视区距离           全兼容

pageX/Y     到整个页面的距离

offsetX/Y    到当前元素的距离



- **拖拽小实例**

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <style media="screen">
    body {height:3000px;}
    #div1 {width:200px;height:200px;background:#CCC;position:fixed; left:10px; top:50px;}
    </style>
  </head>
  <body>
    <div id="div1"></div>
    <script>
    let div=document.getElementById('div1');

    div.onmousedown=function (ev){
      let disX=ev.offsetX;
      let disY=ev.offsetY;

      document.onmousemove=function (ev){
        div.style.left=ev.clientX-disX+'px';
        div.style.top=ev.clientY-disY+'px';
      };
      document.onmouseup=function (){
        document.onmousemove=null;
        document.onmouseup=null;
      };
    };
    </script>
  </body>
</html>

```

- **获取子级的offset**
  
  方法一（推荐）

  ```html
   <!DOCTYPE html>
        <html lang="en" dir="ltr">
         <head>
           <meta charset="utf-8">
           <title></title>
           <style media="screen">
           body {height:3000px;}
           #div1 {width:200px;height:200px;background:#CCC;}
           </style>
         </head>
         <body>
           <div id="div1">
             <button type="button">aaaa</button>
             <button type="button">aaaa</button>
             <button type="button">aaaa</button>
             <button type="button">aaaa</button>
           </div>
           <script>
           let div=document.getElementById('div1');
           div.onclick=function (ev){
             // console.log(ev.offsetX, ev.offsetY);
             let offsetX=ev.pageX-div.offsetLeft;
             let offsetY=ev.pageY-div.offsetTop;
     
             console.log(offsetX, offsetY);
           };
           </script>
         </body>
       </html>
     
  ```
  
   方法二
  
  ```html
   <!DOCTYPE html>
     <html lang="en" dir="ltr">
       <head>
         <meta charset="utf-8">
         <title></title>
         <style media="screen">
         body {height:3000px;}
         #div1 {width:200px;height:200px;background:#CCC;position: absolute;}
         </style>
       </head>
       <body>
         <div id="div1">
           <button type="button">aaaa</button>
           <span>
             <button type="button">aaaa</button>
           </span>
           <button type="button">aaaa</button>
           <button type="button">aaaa</button>
         </div>
         <script>
         let div=document.getElementById('div1');
         div.onclick=function (ev){
           let x=ev.offsetX;
           let y=ev.offsetY;
     
           let obj=ev.srcElement;
         
           while(obj!=this){
             x+=obj.offsetLeft;
             y+=obj.offsetTop;
         
             obj=obj.offsetParent;
           }
         
           console.log(x, y);
         };
         </script>
       </body>
     </html>
  ```



6.键盘事件

ctrlKey、shiftKey、altKey    

onkeydown/up    oninput

keyCode 键码——不分大小写

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <input type="text" id="txt1">
    <script>
    let txt=document.getElementById('txt1');

    txt.onkeydown=function (ev){
      if(ev.keyCode==13){
        alert('搜索');
      }
    };
    </script>
  </body>
</html>

```

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <input type="text" id="txt1">
    <script>
    let txt=document.getElementById('txt1');

    txt.onkeydown=function (ev){
      // if(ev.keyCode==16){
      //
      // }

      if(ev.shiftKey){
        
      }
    };
    </script>
  </body>
</html>

```

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <input type="text" id="txt1">
    <script>
    let txt=document.getElementById('txt1');

    // txt.onkeydown=function (){
    txt.onkeydown=function (ev){
      console.log(ev.key);
    };
    </script>
  </body>
</html>

```



7.事件捕获

addEventListener()的第二个参数改成true就变成事件捕获了

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="div1">
      <button type="button">aaa</button>
    </div>
    <script>
    let div1=document.getElementById('div1');
    let btn=div1.children[0];

    div1.addEventListener('click', function (ev){
      alert('div');

      console.log(ev.srcElement);

      ev.cancelBubble=true;
    }, true);
    btn.addEventListener('click', function (){
      alert('btn');
    }, true);
    </script>
  </body>
</html>

```



8.onmouseover/onmouseout

   onmouseenter/onmouseleave

用两个列子说明区别：

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <style media="screen">
    #div1 {width:300px;height:300px;background:#CCC}
    </style>
  </head>
  <body>
    <div id="div1">
      <button type="button">aaa</button>
    </div>
    <script>
    let div1=document.getElementById('div1');

    div1.onmouseover=function (){
      alert('over');
    };
    </script>
  </body>
</html>

```

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <style media="screen">
    #div1 {width:300px;height:300px;background:#CCC}
    </style>
  </head>
  <body>
    <div id="div1">
      <button type="button">aaa</button>
    </div>
    <script>
    let div1=document.getElementById('div1');

    div1.onmouseenter=function (){
      alert('over');
    };
    </script>
  </body>
</html>

```



9.加载事件

onload              所有内容加载完成=html、css、js、img、video、audio、...

​						   img.onload     window.onload等

DOMContentLoaded    HTML、CSS、JS



10.自定义事件

dispatchEvent  触发DOM事件

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <button type="button" id="btn1">按钮1</button>
    <button type="button" id="btn2">按钮2</button>
    <script>
    let btn1=document.querySelector('#btn1');
    let btn2=document.querySelector('#btn2');

    btn1.addEventListener('click', function (){
      alert('dfasdfsda');
    }, false);

    btn2.onclick=function (){
      let ev=new Event('click');

      btn1.dispatchEvent(ev);
    };
    </script>
  </body>
</html>

```

也可以继承Event

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <button type="button" id="btn1">按钮1</button>
    <button type="button" id="btn2">按钮2</button>
    <script>
    let btn1=document.querySelector('#btn1');
    let btn2=document.querySelector('#btn2');

    class MyEvent extends Event{
      constructor(...args){
        super(...args);

        this.a=12;
      }
    }

    btn1.addEventListener('aaa', function (ev){
      alert('dfasdfsda');
      console.log(ev);
    }, false);

    btn2.onclick=function (){
      let ev=new MyEvent('aaa');

      btn1.dispatchEvent(ev);
    };
    </script>
  </body>
</html>

```

用自定义事件代替DOM事件
```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script src="js/pipe.js" charset="utf-8"></script>
  </head>
  <body>
    <button type="button" id="btn1">按钮1</button>
    <button type="button" id="btn2">按钮2</button>
    <script>
    let btn1=document.querySelector('#btn1');
    let btn2=document.querySelector('#btn2');

    const pipe=new Pipe();

    class MyEvent extends Event{
      constructor(...args){
        super(...args);

        this.a=12;
      }
    }

    pipe.addListener('aaa', (a, b)=>{
      alert('sdfasfsda');

      console.log(a, b);
    });
    // btn1.addEventListener('aaa', function (ev){
    //   alert('dfasdfsda');
    //   console.log(ev);
    // }, false);

    btn2.onclick=function (){
      // let ev=new MyEvent('aaa');
      //
      // btn1.dispatchEvent(ev);

      pipe.dispatch('aaa', 12, 5);
    };
    </script>
  </body>
</html>

```
pipe.js
```JS
class Pipe{
  constructor(){
    this.pipes={};
  }

  addListener(type, fn){
    this.pipes[type]=this.pipes[type]||[];

    if(this.pipes[type].findIndex(func=>func==fn)==-1){
      this.pipes[type].push(fn);
    }
  }

  off(type, fn){
    if(this.pipes[type]){
      this.pipes[type]=this.pipes[type].filter(func=>func!=fn);

      if(this.pipes[type].length==0){
        delete this.pipes[type];
      }
    }
  }

  dispatch(type, ...args){
    if(this.pipes[type]){
      this.pipes[type].forEach(fn=>{
        fn(...args);
      });
    }
  }
}

```

以下两个实例测试自定义事件和DOM事件的性能:

DOM事件性能

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <button type="button" id="btn1">按钮1</button>
    <button type="button" id="btn2">按钮2</button>
    <script>
    let btn1=document.querySelector('#btn1');
    let btn2=document.querySelector('#btn2');

    class MyEvent extends Event{
      constructor(...args){
        super(...args);

        this.a=12;
      }
    }

    btn1.addEventListener('aaa', function (ev){
      // alert('dfasdfsda');
      // console.log(ev);
    }, false);


    //750
    let start=Date.now();
    for(let i=0;i<100000;i++){
      let ev=new MyEvent('aaa');

      btn1.dispatchEvent(ev);
    }
    console.log(Date.now()-start);
    </script>
  </body>
</html>

```

自定义事件性能

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script src="js/pipe.js" charset="utf-8"></script>
  </head>
  <body>
    <button type="button" id="btn1">按钮1</button>
    <button type="button" id="btn2">按钮2</button>
    <script>
    let btn1=document.querySelector('#btn1');
    let btn2=document.querySelector('#btn2');
    let pipe=new Pipe();

    pipe.addListener('aaa', ()=>{

    });


    //750
    //43
    let start=Date.now();
    for(let i=0;i<100000;i++){
      pipe.dispatch('aaa');
    }
    console.log(Date.now()-start);
    </script>
  </body>
</html>

```

组件间数据通信

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>

<script>
class Pipe{
  constructor(){
    this.pipes={};
  }

  on(type, fn){
    this.pipes[type]=this.pipes[type]||[];

    if(this.pipes[type].findIndex(func=>func==fn)==-1){
      this.pipes[type].push(fn);
    }
  }

  off(type, fn){
    if(this.pipes[type]){
      this.pipes[type]=this.pipes[type].filter(func=>func!=fn);

      if(this.pipes[type].length==0){
        delete this.pipes[type];
      }
    }
  }

  emit(type, ...args){
    if(this.pipes[type]){
      this.pipes[type].forEach(fn=>{
        fn(...args);
      });
    }
  }
}

</script>
  </head>
  <body>
    <div id="div1">
      {{a}}
    </div>

    <div id="div2">
      <button type="button">++</button>
    </div>

    <script>
    const $=document.querySelectorAll.bind(document);
    const pipe=new Pipe();


    class Component1{
      constructor(){
        this.a=12;

        this.el=$('#div1')[0];

        this.render();

        //
        pipe.on('add', ()=>{
          this.a++;
          this.render();
        });
      }

      render(){
        this.el.innerHTML=this.a;
      }
    }

    class Component2{
      constructor(){
        this.el=$('#div2')[0];

        this.el.children[0].onclick=()=>{
          pipe.emit('add');
        };
      }
    }
    new Component1();
    new Component2();
    </script>
  </body>
</html>

```

10.addEventListener()的第二个参数可以传一个对象(比如this),当事件触发时，这个对象的`handleEvent`方法被调用，像这样：

```js
document.body.addEventListener(
    'click',
    {
        handleEvent: function() {
            alert('body clicked');
        }
    },
    false);
```

