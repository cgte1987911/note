import Vue from './vue';
import {assert} from './common';

export default class Router{
  constructor(options){
    assert(options);
    assert(options.routes);
    assert(options.routes instanceof Array);

    this.routes=[...options.routes];
    this._vue=null;

  }

  init(){
    this._els=Array.from(document.getElementsByClassName('--router-view'));

    window.addEventListener('hashchange', ()=>{
      this.parse();
    }, false);

    this.parse();
  }

  parse(){
    let hash=location.hash.substring(1);

    if(hash){
      let route=this.routes.find(route=>route.path==hash);
      assert(route, `path "${hash}" is not defined`);
      assert(route.component, 'component is required');

      //
      for(let i=0;i<this._els.length;i++){
        let cmp=document.createElement(route.component);
        this._els[i].parentNode.replaceChild(cmp, this._els[i]);

        let vdom=this._vue.createComponent(
          cmp,
          this._vue
        );

        this._els[i]=vdom.root._el;
      }

      this._vue._data.$route=route;



      // let cmp=new Vue({
      //   ...component
      // });
      // console.log(cmp);
    }
  }
}

Vue.component('router-link', {
  props: ['to'],
  template: `
    <a :href="'#'+to">
      <slot></slot>
    </a>
  `
});
Vue.component('router-view', {
  template: `
    <div class="--router-view">aaaaaaa</div>
  `
});
