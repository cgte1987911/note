function _parseAttrName(name){
  return name.replace(/[A-Z]/g, s=>{
    return '-'+s.toLowerCase();
  });
}

class Shape{
  constructor(type, data){
    this._el=this._create(type);

    this._data=this._data(data);

    this._render();
  }

  _create(type){
    return document.createElementNS('http://www.w3.org/2000/svg', type);
  }

  _data(data){
    let _this=this;
    let _data=new Proxy({
      ...data,
      animate: this.animate.bind(this),
    }, {
      get(data, name){
        return data[_parseAttrName(name)];
      },
      set(data, name, val){
        data[_parseAttrName(name)]=val;
        // _this._el.setAttribute(name, val);

        _this._render();

        return true;
      }
    });

    return _data;
  }

  //line.animate({x1: 300, y2: 200}, {time: 500})
  animate(attrs, options){
    options=Object.assign({
      time: 500,
      timing: linear
    }, options);

    //animate(start, end, time, cb)
    let start={};
    for(let key in attrs){
      start[key]=this._data[key];
    }

    animate(start, attrs, options.time, attrs=>{
      for(let key in attrs){
        this._data[key]=attrs[key];
      }

      options.cb&&options.cb();
    }, options.timing);
  }

  _render(){
    throw new Error('render not defined');
  }

  _draw(gd){
    throw new Error('no draw defined');
  }
}
