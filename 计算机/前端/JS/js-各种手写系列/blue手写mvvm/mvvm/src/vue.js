import {assert,dom} from './common';
import {parseDOM} from './parser';
import {createVDom} from './vdom';
import {createProxy} from './proxy';
import VElement from './velement';
import directives from './directives';
import {Store} from './vuex';
import EventQueue from './event';

const uuid=require('uuid/v4');


export default class Vue extends EventQueue{
  constructor(options){
    super();

    this.__watch_target=[];
    this.$options=options;

    this.$refs={};

    this.name=uuid();

    this.components=options.components||{};

    //store连接
    if(options.store){
      assert(options.store instanceof Store);
      this.$store=options.store;
      options.store._vue=options.store._vue||this;
    }

    //
    this._staticData={
      ...options.methods,
      __vue: this,
      //store连接到模板
      $store: options.store,
      $emit: this.$emit.bind(this),
      $on:   this.$on.bind(this),
      $refs:  this.$refs,
    };
    // console.log(this._staticData);

    let __data;
    if(typeof options.data=='function'){
      __data=options.data();
    }else{
      __data= options.data;
    }

    this._data=createProxy(__data||{}, this._staticData, path=>{
      //watch
      for(let i=0;i<path.length;i++){
        let str=path.slice(0, i+1).join('.');

        let watch=this._watchs[str];

        if(watch){
          this.__watch_target.push(watch);
        }
      }

      //computed
      this._doCompute();

      this.forceUpdate();
    });

    this._doCompute();

    this._watchs=options.watch||{};


    this._directives={
      ...directives,
      ...options.directives
    };

    //初始化——init
    let el;
    if(typeof options.el=='string'){
      el=dom(options.el);
    }else{
      el=options.el;
    }

    let vdomTree=this.createComponent(el, this);

    //
    this.created=options.created;
    this.updated=options.updated;
    this.mounted=options.mounted;

    this.root=vdomTree;
    // this._data=createProxy(options.data||{}, ()=>{
    // this._data=createProxy({...options.data, ...options.methods}, ()=>{
    //   this.render();
    // });

    //router
    if(options.router){
      let router=options.router;

      router._vue=this;
      router.init();

      this.$router=router;
    }




    //初始化所有element
    this.root.init();


    this.status='init';
    this.created && this.created.call(this._data);


    //
    this._render_timer=0;

    //更新——update
    this.render();

    this.mounted && this.mounted.call(this._data);

    return this._data;
  }

  init(){
    console.log('init');
  }

  _doCompute(){
    const options=this.$options;
    for(let key in options.computed){
      let fn=options.computed[key];

      this._staticData[key]=fn.call(this._data);
    }
  }

  forceUpdate(){
    clearTimeout(this._render_timer);
    this._render_timer=setTimeout(()=>{
      this.render();
    }, 0);
  }

  render(){
    // console.log('[component render]', this.name);

    //渲染自己
    this.root.render();

    //watch
    this.__watch_target.forEach(fn=>{
      fn.call(this._data);
    });
    this.__watch_target.length=0;

    this.status='update';
    this.updated && this.updated.call(this._data);
  }





  createComponent(el, vue){
    let domTree=parseDOM(el);
    function findRef(node){
      if(!node.attrs)return;

      if(node.attrs.ref){
        node.ref=node.attrs.ref
      }

      node.children.forEach(child=>findRef(child));
    }
    findRef(domTree);

    let vdomTree=createVDom(domTree, this, this);

    // this.vdom=vdomTree;

    let findAndCreateComponent=(node,parent)=>{
      if(node._blue){
        let component;

        if(node.tag!='component'){
          component=vue.components[node.tag]||components[node.tag];
          assert(component, `no "${node.tag}" component found`);
        }else{
          assert(node.attrs.is, `no "is" attribute`);
          component=vue.components[node.attrs.is]||components[node.attrs.is];
          assert(component, `no "${node.tag}" component found`);
        }

        //
        assert(component.template!==undefined, `"${node.tag}" component no template attribute`);

        let oDiv=document.createElement('div');
        oDiv.innerHTML=component.template;
        assert(oDiv.children.length==1, `component template MUST BE has a root element`);

        let slots=oDiv.getElementsByTagName('slot');

        Array.from(slots).forEach(slot=>{
          let fragment=document.createDocumentFragment();

          node.children.forEach(child=>{
            fragment.appendChild(child.el.cloneNode(true));
          });

          slot.parentNode.replaceChild(fragment, slot);
        });



        let root=oDiv.children[0];
        node.el.parentNode.replaceChild(root, node.el);

        // let domTree2=parseDOM(root);
        // let vdomTree2=createVDom(domTree2, parent, this);

        let cmp=new Vue({
          el: root,
          ...component,
          store: vue.$store
        }).__vue;

        cmp.$root=cmp;

        if(node.ref){
          vue.$refs[node.ref]=cmp;
        }

        //props
        component.props && component.props.forEach(name=>{
          cmp._data[name]=node.attrs[name];
        });
        // console.log(cmp);

        return cmp;
      }else{
        if(node instanceof VElement){
          for(let i=0;i<node.$children.length;i++){
            node.$children[i]=findAndCreateComponent(
              node.$children[i],
              node
            );
          }
        }

        return node;
      }
    };
    vdomTree=findAndCreateComponent(vdomTree, this);

    return vdomTree;
  }
};

let components={};
Vue.component=function (name, options){
  components[name]=options;
};
