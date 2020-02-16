class VComponent extends VElement{
  constructor(options){
    assert(options);
    assert(options.el);

    let el=null;
    if(typeof options.el=='string'){
      el=document.querySelector(options.el);
      assert(el, `element "${options.el}" is not found`);
    }else if(options.el instanceof HTMLElement){
      el=options.el;
    }

    super(el);

    //
    this._el=el;

    const _this=this;
    this._data=new Proxy(options.data||{}, {
      get(data, name){
        assert(name in data, `data "${name}" is not defined`);
      },
      set(data, name, value){
        data[name]=value;

        _this.render();

        return true;
      }
    });

    this._methods=options.methods||{};
  }

  render(){
    //自己渲染
    //....

    //渲染子级
    this._children.forEach(child=>child.render());
  }
}
