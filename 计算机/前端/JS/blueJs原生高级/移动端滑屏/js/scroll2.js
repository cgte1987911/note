function assert(exp, msg){
  if(!exp){
    throw new Error(msg||'assert faild');
  }
}

function getElement(el){
  assert(el);

  if(typeof el=='string'){
    let element=document.querySelector(el);
    assert(element);

    return element;
  }else if(el instanceof HTMLElement){
    return el;
  }else{
    assert(false);
  }
}

const defaultOptions={
  scrollX: false,
  scrollY: true,
  factor: 0.3,
  animateDuration: 300,
  animateType: 'ease',
};

class Scroll extends Pipe{
  constructor(el, options){
    super();

    //
    this.root=getElement(el);
    assert(this.root.children[0]);
    this.container=this.root.children[0];

    //
    this.options=Object.assign({}, defaultOptions, options);

    //
    this.position={x:0,y:0};
    //
    this._initEvent();
  }

  destroy(){
    this.root.removeEventListener('touchstart', this.__start, false);
    this.root.removeEventListener('touchmove', this.__move, false);
    this.root.removeEventListener('touchend', this.__end, false);
  }

  _initEvent(){
    let startX,startY;
    let startPosition;

    this.__start=ev=>{
      ev.preventDefault();
      ev.cancelBubble=true;

      startX=ev.targetTouches[0].clientX;
      startY=ev.targetTouches[0].clientY;

      startPosition={...this.position};

      this._doStart();
    };
    this.__move=ev=>{
      ev.cancelBubble=true;

      let disX=ev.targetTouches[0].clientX-startX;
      let disY=ev.targetTouches[0].clientY-startY;

      this.position.x=startPosition.x+disX;
      this.position.y=startPosition.y+disY;

      this._doMove();
    };
    this.__end=ev=>{
      ev.cancelBubble=true;

      this._doEnd();
    };

    this.root.addEventListener('touchstart', this.__start, false);
    this.root.addEventListener('touchmove', this.__move, false);
    this.root.addEventListener('touchend', this.__end, false);
  }

  _doStart(){
    this.container.style.transition='';

    //触发——start
    this.emit('start');
  }

  _doMove(){
    let {x,y}=this.position;

    let maxX;
    if(this.root.offsetWidth<=this.container.offsetWidth){
      maxX=this.container.offsetWidth-this.root.offsetWidth;
    }else{
      maxX=0;
    }

    let maxY;
    if(this.root.offsetHeight<=this.container.offsetHeight){
      maxY=this.container.offsetHeight-this.root.offsetHeight;
    }else{
      maxY=0;
    }

    if(x>0){
      x*=this.options.factor;
    }
    if(y>0){
      y*=this.options.factor;
    }

    if(x<-maxX){
      x=-maxX+(x+maxX)*this.options.factor;
    }
    if(y<-maxY){
      y=-maxY+(y+maxY)*this.options.factor;
    }


    if(this.options.scrollX && this.options.scrollY){
      this.container.style.transform=`translate(${x}px, ${y}px)`;
    }else if(this.options.scrollX){
      this.container.style.transform=`translateX(${x}px)`;
    }else if(this.options.scrollY){
      this.container.style.transform=`translateY(${y}px)`;
    }

    //触发——move
    this.emit('move', x, y);
  }

  _doEnd(){
    let {x,y}=this.position;

    let maxX;
    if(this.root.offsetWidth<=this.container.offsetWidth){
      maxX=this.container.offsetWidth-this.root.offsetWidth;
    }else{
      maxX=0;
    }

    let maxY;
    if(this.root.offsetHeight<=this.container.offsetHeight){
      maxY=this.container.offsetHeight-this.root.offsetHeight;
    }else{
      maxY=0;
    }

    if(x>0){
      x=0;
    }
    if(x<-maxX){
      x=-maxX;
    }

    if(y>0){
      y=0;
    }
    if(y<-maxY){
      y=-maxY;
    }

    //
    this.position.x=x;
    this.position.y=y;

    this.container.style.transition=`${this.options.animateDuration}ms transform ${this.options.animateType}`;

    if(this.options.scrollX && this.options.scrollY){
      this.container.style.transform=`translate(${x}px, ${y}px)`;
    }else if(this.options.scrollX){
      this.container.style.transform=`translateX(${x}px)`;
    }else if(this.options.scrollY){
      this.container.style.transform=`translateY(${y}px)`;
    }

    //
    this.emit('end');
  }
}
