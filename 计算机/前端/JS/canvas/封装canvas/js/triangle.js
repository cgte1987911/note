class Triangle extends Sprite{
  constructor(canvas, w, h){
    super(canvas);

    this._data.w=w;
    this._data.h=h;
  }

  render(gd){
    gd.beginPath();

    gd.moveTo(
      this._data.x+this._data.w/2,
      this._data.y
    );

    gd.lineTo(
      this._data.x, this._data.y+this._data.h
    );

    gd.lineTo(
      this._data.x+this._data.w, this._data.y+this._data.h
    );

    gd.closePath();


    gd.stroke();
  }
}
