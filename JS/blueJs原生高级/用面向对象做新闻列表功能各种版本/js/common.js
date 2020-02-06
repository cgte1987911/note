function _getRoot(options){
  assert(options.root, 'root不能为空');

  if(typeof options.root=='string'){
    let root=document.querySelector(options.root);
    assert(root, `找不到: ${options.root}`);

    return root;
  }else if(options.root instanceof HTMLElement){
    return options.root;
  }else{
    assert(false, 'root不合法');
  }
}

function _getData(options){
  assert(options.data, `data不能没有`);
  assert(typeof options.data=='function', `data必须是函数`);

  let data=options.data();
  assert(data, 'data必须有返回值');
  assert(typeof data=='object', 'data必须是object');

  return data;
}


function createClass(cls){
  return new Proxy(cls, {
    construct(cls, args){
      let obj=new cls(...args);

      obj._root=_getRoot(args[0]);
      let data=_getData(args[0]);

      for(let name in data){
        obj[name]=data[name];
      }

      obj.render();

      return new Proxy(obj, {
        set(obj, name, val){
          obj[name]=val;

          obj.render();
        }
      });
    }
  });
}
