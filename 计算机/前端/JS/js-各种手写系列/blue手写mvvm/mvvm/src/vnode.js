import {assert} from './common';
import EventQueue from './event';
const uuid=require('uuid/v4');

export default class VNode extends EventQueue{
  constructor(el, parent){
    super();

    assert(el);
    assert(el instanceof Node);

    this.status='';

    this._el=el;
    this.$parent=parent;

    this.name=uuid();
  }

  clone(){
    return new VNode(this._el.cloneNode(true), this._component);
  }

  render(){
    throw new Error('render method not defined');
  }
}
