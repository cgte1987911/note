class Pipe{
  constructor(){
    this.pipes={};
  }

  on(type, fn){
    this.pipes[type]=this.pipes[type]||[];

    if(this.pipes[type].findIndex(func=>func==fn)==-1){
      this.pipes[type].push(fn);
    }
  }

  off(type, fn){
    if(this.pipes[type]){
      this.pipes[type]=this.pipes[type].filter(func=>func!=fn);

      if(this.pipes[type].length==0){
        delete this.pipes[type];
      }
    }
  }

  emit(type, ...args){
    if(this.pipes[type]){
      this.pipes[type].forEach(fn=>{
        fn(...args);
      });
    }
  }
}
