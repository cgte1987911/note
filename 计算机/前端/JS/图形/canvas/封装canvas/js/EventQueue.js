class EventQueue{
  constructor(){
    this._events={};
  }

  on(type, fn){
    this._events[type]=this._events[type]||[];

    this._events[type].push(fn);
  }
  emit(type, ...args){
    if(this._events[type]){
      this._events[type].forEach(fn=>{
        fn(...args);
      });
    }
  }
}
