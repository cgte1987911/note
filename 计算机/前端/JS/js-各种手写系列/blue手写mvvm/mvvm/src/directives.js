import {assert} from './common';
import {expr} from './exprsion';
import {createVDom} from './vdom';

// import VElement from './velement';



export default {
  //{name: "bind", arg: 'title', value: "a+b"}
  bind: {
    init(velement, directive){
      directive.meta._last_data='';
    },
    update(velement, directive){
      assert(velement);
      // assert(velement instanceof VElement);
      assert(assert);
      assert(directive);
      assert(directive.arg);
      assert(directive.value);

      let result=expr(directive.value, velement._proxy);

      if(directive.meta._last_data!=result){
        velement._el.setAttribute(directive.arg, result);
        velement._el['directive.arg']=result;

        directive.meta._last_data=result;

        console.log('[velement rendered]', velement.name);
      }
    },
    destory: null,
  },

  //{name: "on", arg: 'click', value: "a+b"}
  on: {
    init(velement, directive){
      //TODO
      velement._el.addEventListener(directive.arg, function (ev){
        let str=directive.value;
        if(/^[\$_a-z][a-z0-9_\$]*$/i.test(str)){
          str+='($event)';    //?
        }

        //velement._component._data.$event=ev;
        velement._set('$event', ev);
        expr(str, velement._proxy);
      }, false);
    },
    update: null,
    destory(){

    }
  },
  cloak: {
    update(velement){
      velement._el.removeAttribute('v-cloak');
    }
  },
  //{name: "show", arg: undefined, value: "show"}
  show:{
    init: null,
    update(velement, directive){
      assert(velement);
      // assert(velement instanceof VElement);
      assert(assert);
      assert(directive);
      assert(directive.value);

      let result=expr(directive.value, velement._data);

      if(result){
        velement._el.style.display='';
      }else{
        velement._el.style.display='none';
      }
    },
    destory: null,
  },
  'if': {
    init(velement, directive){
      let holder=document.createComment('vue holder');

      velement.__parent=velement._el.parentNode;

      velement.__holder=holder;
      velement.__el=velement._el;
    },
    update(velement, directive){
      let res=expr(directive.value, velement._data);

      if(res){
        if(velement.__holder.parentNode){
          velement.__parent.replaceChild(velement.__el, velement.__holder);
        }

      }else{
        velement.__parent.replaceChild(velement.__holder, velement.__el);
      }
    },
    destory(velement, directive){}
  },
  'else-if': {
    init(velement, directive){},
    update(velement, directive){},
    destory(velement, directive){}
  },
  'else': {
    init(velement, directive){},
    update(velement, directive){},
    destory(velement, directive){}
  },
  'for': {
    init(velement, directive){
      velement.$directives=velement.$directives.filter(item=>item!=directive);

      let template=directive.meta.template=velement;
      let parentNode=directive.meta.parent=velement._el.parentNode;

      let holder=directive.meta.holder=document.createComment('for holder');
      parentNode.replaceChild(holder, template._el);

      directive.meta.elements=[];


      //上一次的数据
      let last=[];

      //
      velement.render=function (){
        const template=directive.meta.template;
        const parentNode=directive.meta.parent;
        const holder=directive.meta.holder;
        let elements=directive.meta.elements;

        //删除掉
        let oldElements=[...elements];
        elements.forEach(element=>{
          parentNode.removeChild(element._el);
        });
        elements.length=0;

        //
        let newElements=[];

        //
        let {key, value, data}=parseFor(directive.value);

        last=[...last];

        let iter=expr(data, velement._proxy);

        //diff

        newElements.length=iter.length;

        for(let i=0;i<iter.length;i++){
          let item=iter[i];
          let index=i;

          // console.log(last, item, last.indexOf(item))
          let n=last.findIndex(i=>i==item);

          if(n!=-1){
            newElements[index]=oldElements[n];
            oldElements.splice(n,1);
            last.splice(n,1);
          }else{
            newElements[index]=null;
          }
        }

        newElements.forEach((item,index)=>{
          if(item)return;

          if(oldElements.length>0){
            newElements[index]=oldElements.pop();
          }else{
            newElements[index]=template.clone();
            newElements[index].init();
          }
        });

        last=iter;
        elements=newElements;

        let fragment=document.createDocumentFragment();
        newElements.forEach((element,index)=>{
          key && element._set(key, index);
          element._set(value, iter[index]);

          fragment.appendChild(element._el);
        });
        parentNode.insertBefore(fragment, holder);

        elements.forEach(velement=>{
          // console.log(elements);
          velement.render();
        });



        directive.meta.elements=elements;
      };
    },
    update(velement, directive){

    },
    destory(velement, directive){}
  },
  //{name: "show", arg: undefined, value: "show"}
  html: {
    update(velement, directive){
      assert(velement);
      // assert(velement instanceof VElement);
      assert(assert);
      assert(directive);
      assert(directive.value);

      let result=expr(directive.value, velement._data);
      velement._el.innerHTML=result;
    }
  },
  text: {
    update(velement, directive){
      assert(velement);
      // assert(velement instanceof VElement);
      assert(assert);
      assert(directive);
      assert(directive.value);

      let result=expr(directive.value, velement._data);
      let node=document.createTextNode(result);

      velement._el.innerHTML='';
      velement._el.appendChild(node);
    }
  }
};







function parseFor(str){
  //str=>'xxx in xxx'
  //str=>'xxx,xx in xx'

  let arr=str.split(' in ');
  let [value,key]=arr[0].split(',');

  return {
    key,
    value,
    data: arr[1]
  };
}
