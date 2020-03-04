class Line extends Shape{
  constructor(x1, y1, x2, y2){
    super('line', {x1, y1, x2, y2});
  }

  _render(){
    for(let key in this._data){
      this._el.setAttribute(key, this._data[key]);
    }
  }

  _draw(gd){
    gd.beginPath();
    gd.moveTo(this._data.x1, this._data.y1);
    gd.lineTo(this._data.x2, this._data.y2);

    gd.strokeStyle=this._data.stroke;
    console.log(this._data);
    gd.lineWidth=this._data.strokeWidth||1;
    gd.stroke();
  }
}
