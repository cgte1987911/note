(function (){
  function createChildren(dom, component){
    let children=[];

    Array.from(dom.childNodes).forEach(child=>{
      switch(child.nodeType){
        case document.ELEMENT_NODE:
          children.push(
            new VElement(child, component)
          );
          break;
        case document.TEXT_NODE:
          let node=new VText(child, component);

          if(node._text){
            children.push(node);
          }

          break;
        default:
          console.log(`discarded a node: `, child);
      }
    });

    return children;
  }

  function createAttrs(dom){
    let attrs={};

    Array.from(dom.attributes).forEach(attr=>{
      attrs[attr.name]=attr.value;
    });

    return attrs;
  }

  //{name: 'bind', arg: 'title', value: 'a'}
  function createDirectives(attrs){
    let directives=[];

    //指令类型-bind、if、for、...      name
    //指令参数-value、title            arg
    //指令值-12、a、...                value

    //z-, :
    for(let name in attrs){
      if(name.startsWith(':')){
        directives.push({
          name: 'bind',
          arg: name.substring(1),
          value: attrs[name]
        })
      }else if(name.startsWith('z-')){
        let [name2, arg]=name.split(':');
        name2=name2.substring(2);

        directives.push({
          name: name2,
          arg,
          value: attrs[name]
        })
      }else if(name.startsWith('+')){
        directives.push({
          name: 'on',
          arg:  name.substring(1),
          value:attrs[name]
        })
      }
    }

    return directives;
  }

  //{name: 'click', value: 'a+=5'}
  function createListeners(directives){
    assert(directives);

    let listeners=[];
    directives.filter(directive=>directive.name=='on').forEach(({arg, value})=>{
      listeners.push({
        name: arg,
        value
      });
    });

    return listeners;
  }

  window.VElement=class VElement extends VNode{
    constructor(dom, component){
      super(dom);

      this._component=component||this;

      this._type=dom.tagName.toLowerCase();

      //
      this._attrs=createAttrs(dom);
      this._directives=createDirectives(this._attrs);
      this._listeners=createListeners(this._directives);

      //
      this._children=createChildren(dom, this._component);
    }

    render(){

    }
  }

})();
