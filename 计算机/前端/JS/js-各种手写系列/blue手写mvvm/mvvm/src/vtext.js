import {assert} from './common';
import {compileStringTemplate} from './exprsion';
import VNode from './vnode';

export default class VText extends VNode{
  constructor(options, parent){
    assert(options);
    assert(options.el);
    assert(options.data);

    super(options.el, parent);

    //
    this._template=options.data;

    this.status='init';

    //
    this._last_str=undefined;
  }

  render(){
    let str=compileStringTemplate(
      this._template,
      this.$parent._proxy,
      this.$root.$options.filters||{}
    );

    if(this._last_str!==str){
      this._el.data=str;

      this.status='update';

      // console.log('[vtext rendered]', this.name);

      this._last_str=str;
    }
  }
}
