class Pie extends Shape{
  constructor(cx, cy, r, start, end){
    super('path', {cx, cy, r, start, end});
  }

  _render(){
    let {cx,cy,r}=this._data;

    let d=`M${cx},${cy} L${cx},${cy-r} A ${r},${r},0,0,1,${cx+r},${cy} Z`;

    this._el.setAttribute('d', d);
  }
}
