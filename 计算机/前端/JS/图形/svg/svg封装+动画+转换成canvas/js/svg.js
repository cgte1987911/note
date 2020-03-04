const types={
  'line': Line,
  'pie': Pie,
};

class Svg{
  constructor(svg){
    this._svg=svg;

    this._children=[];
  }

  create(type, ...args){
    if(!types[type]){
      throw new Error('no this type: '+type);
    }

    let shape=new types[type](...args);
    // shape._data.stroke='black';
    this._children.push(shape);
    this._svg.appendChild(shape._el);

    return shape._data;
  }

  toCanvas(canvas){
    if(!canvas){
      canvas=document.createElement('canvas');
      canvas.width=this._svg.getAttribute('width');
      canvas.height=this._svg.getAttribute('height');
    }

    let gd=canvas.getContext('2d');

    this._children.forEach(child=>{
      child._draw(gd);
    });

    return canvas;
  }
}

for(let type in types){
  Svg.prototype[type]=function (...args){
    return this.create(type, ...args);
  };
}
