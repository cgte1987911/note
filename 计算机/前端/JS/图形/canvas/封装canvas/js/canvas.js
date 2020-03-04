const types={
  'rect': Rect,
  'triangle': Triangle
}

class Canvas{
  constructor(canvas){
    this._canvas=canvas;

    this._children=[];

    this._timer=0;

    this._initEvent();
  }

  create(type, ...args){
    assert(types[type]);
    let cls=types[type];

    let sprite=new cls(this, ...args);

    this._addChild(sprite);

    //
    sprite._data.on=sprite.on.bind(sprite);
    sprite._data.emit=sprite.emit.bind(sprite);

    return sprite._data;
  }

  _addChild(sprite){
    this._children.push(sprite);
  }

  _initEvent(){
    //click
    this._canvas.onclick=ev=>{
      this._children.forEach(child=>{
        if(child._data.needClick){
          let x=ev.offsetX,y=ev.offsetY;

          if(child._isIn(x, y)){
            child.emit('click', x, y);
          }
        }
      });
    };
  }

  needUpdate(){
    clearTimeout(this._timer);
    this._timer=setTimeout(this.render.bind(this), 0);
  }

  render(){
    console.log('render');
    let gd=this._canvas.getContext('2d');

    gd.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._children.forEach(sprite=>{
      sprite.render(gd);
    });
  }
}
