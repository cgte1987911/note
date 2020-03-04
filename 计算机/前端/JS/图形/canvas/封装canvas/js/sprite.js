class Sprite extends EventQueue{
  constructor(canvas){
    assert(canvas);
    assert(canvas instanceof Canvas);

    super();

    this._canvas=canvas;

    let _this=this;
    this._data=new Proxy({
      x: 0, y: 0,
      w: 0, h: 0,
      needClick: false
    }, {
      get(data, name){
        // assert(typeof data[name]!='undefined', `${name} is not defined`);

        return data[name];
      },
      set(data, name, val){
        data[name]=val;

        _this._canvas.needUpdate();

        return true;
      }
    });
  }

  on(type, ...args){
    super.on(type, ...args);

    if(type=='click'){
      this._data.needClick=true;
    }
  }

  render(gd){
    throw new 'no render';
  }

  _isIn(x, y){
    throw new Error('no isIn method');
  }
}
