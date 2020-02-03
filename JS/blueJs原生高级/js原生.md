### 1.类型判断

**typeof**   只能检测基本类型（如[1,2,3],{a:1,b:2}都检测为object）

**instanceof**       检测是不是类的实例（不光检测自己类型还检测父级类型）

**constructor**     返回实例构造器

​							精确类型判断（只包括子级，不包括父级）

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



