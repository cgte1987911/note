import {assert} from './common';

export class Store{
  constructor(options){
    assert(options);
    assert(options.state);

    this.state=options.state;
    this._mutations=options.mutations||{};
    this._actioins=options.actions||{};

    this._vue=null;

    this.strict=options.strict;

    if(options.strict){
      this.lastState=cloneData(this.state);

      //定期检查state有没有意外修改
      setInterval(()=>{
        //原始状态
        // this.lastState

        //现在状态
        // this.state

        //比较
        if(!compareData(this.lastState, this.state)){
          console.error('vuex data changed');
          this.lastState=cloneData(this.state);
        }
      }, 100);
    }
  }

  commit(name, ...args){
    let mutation=this._mutations[name];
    assert(mutation, `mutation "${name}" is not defined`);

    // this._data
    mutation(this.state, ...args);
    // this._data

    //通知vue
    assert(this._vue, 'Store must be a param of Vue');
    this._vue.forceUpdate();

    if(this.strict){
      this.lastState=cloneData(this.state);
    }
  }

  async dispatch(name, ...args){
    let action=this._actioins[name];
    assert(action, `action "${name}" is not defined`);

    await action(this, ...args);
  }
}





function cloneData(data){
  if(data instanceof Array){
    let data2=[];

    for(let i=0;i<data.length;i++){
      data2[i]=cloneData(data[i]);
    }

    return data2;
  }else if(typeof data=='object'){
    let data2={};

    for(let i in data){
      data2[i]=cloneData(data[i]);
    }

    return data2;
  }else{
    return data;
  }
}

function compareData(data1, data2){
  if(data1==data2){
    return true;
  }

  if(typeof data1!=typeof data2){
    return false;
  }

  if(data1 instanceof Array){
    for(let i=0;i<data1.length;i++){
      let b=compareData(data1[i], data2[i]);

      if(b==false){
        return false;
      }
    }

    return true;
  }else if(typeof data1=='object'){
    for(let i in data1){
      let b=compareData(data1[i], data2[i]);

      if(b==false){
        return false;
      }
    }

    return true;
  }else{
    return data1===data2;
  }
}
