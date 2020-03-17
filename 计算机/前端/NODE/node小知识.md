### require方法中的文件查找策略(指内置模块和第三方模块)：

1. 从module path数组中取出第一个目录作为查找基准。 
2. 直接从目录中查找该文件，如果存在，则结束查找。如果不存在，则进行下一条查找。
3. 尝试添加.js、.json、.node后缀后查找，如果存在文件，则结束查找。如果不存在，则进行下一条。
4. 尝试将require的参数作为一个包来进行查找，读取目录下的package.json文件，取得main参数指定的文件。
5. 尝试查找该文件，如果存在，则结束查找。如果不存在，则进行第3条查找。 
6. 如果继续失败，则取出module path数组中的下一个目录作为基准查找，循环第1至5个步骤。 
7. 如果继续失败，循环第1至6个步骤，直到module path中的最后一个值。 
8. 如果仍然失败，则抛出异常。



### process.argv简单了解一下

process 对象是一个全局变量，它提供当前 Node.js 进程的有关信息，以及控制当前 Node.js 进程。 因为是全局变量，所以无需使用 require()。

process.argv 属性返回一个数组，这个数组包含了启动Node.js进程时的命令行参数，

其中：

数组的第一个元素process.argv[0]——返回启动Node.js进程的可执行文件所在的绝对路径

第二个元素process.argv[1]——为当前执行的JavaScript文件路径

剩余的元素为其他命令行参数

例如：

输入命令：node scripts/build.js "web-runtime-cjs,web-server-renderer"
  结果：

console.log(process.argv[0])   // 打印 C:\Program Files\nodejs\node.exe
console.log(process.argv[1])   // 打印 C:\Users\hongf\Desktop\testallin\test.js
console.log(process.argv[2])   // 打印 web-runtime-cjs,web-server-renderer



### 知识点

1.进程使用示例：

```js
const cluster=require('cluster');

if(cluster.isMaster){
  for(let i=0;i<2;i++){
    let worker=cluster.fork();

    worker.on('disconnect', ()=>{
      console.log('断了');
    });

    worker.send({index: i});
  }

  console.log('主进程');
}else{
  console.log('子进程');

  process.on('message', function (json){
    console.log(json);
  });
}
```

