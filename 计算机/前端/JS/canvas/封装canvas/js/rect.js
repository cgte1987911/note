class Rect extends Sprite{
  constructor(canvas, w, h){
    super(canvas);

    this._data.w=w;
    this._data.h=h;
  }

  render(gd){
    gd.fillStyle=this._data.bgcolor||'#000';

    gd.fillRect(this._data.x, this._data.y, this._data.w, this._data.h);
  }

  _isIn(x, y){
    return x>=this._data.x &&
      x<=this._data.x+this._data.w &&
      y>=this._data.y &&
      y<=this._data.y+this._data.h;
  }
}
