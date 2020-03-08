import {assert} from './common';

export function parseDOM(dom){
  assert(dom);
  assert(dom instanceof Node);

  if(dom.nodeType==document.ELEMENT_NODE){
    //1.type——标签
    let tag=dom.tagName.toLowerCase();

    //2.属性
    let attrs={};
    Array.from(dom.attributes).forEach(attr=>{
      attrs[attr.name]=attr.value;
    });

    //3.children
    let children=Array.from(dom.childNodes).map(child=>parseDOM(child)).filter(child=>child!==undefined);

    let ishtml=dom.constructor!==HTMLUnknownElement&&dom.constructor!==HTMLElement;

    return {
      type: 'element',
      el: dom,
      tag,
      attrs,
      children,
      ishtml,
      _blue: true,
    }
  }else if(dom.nodeType==document.TEXT_NODE){
    let str=dom.data.trim();

    if(str){
      return {
        type: 'text',
        el: dom,
        data: str,
        _blue: true,
      }
    }else{
      return undefined;
    }
  }
}

export function parseDirectives(attrs){
  assert(attrs);
  assert(attrs.constructor==Object);

  let directives=[];

  //v-
  //:   v-bind:xxxx
  //@   v-on:xxx

  for(let key in attrs){
    let direcitve;

    if(key.startsWith('v-')){  //v-if="xxx" v-bind:xxx="xxx" v-show="xxx" @xxx="aaa"
      //名字:参数
      let [name, arg]=key.split(':');

      direcitve={name: name.replace(/^v\-/, ''), arg};
    }else if(key.startsWith(':')){  //:title
      direcitve={name: 'bind', arg: key.substring(1)}
    }else if(key.startsWith('@')){
      direcitve={name: 'on', arg: key.substring(1)};
    }

    if(direcitve){
      assert(direcitve.name=='bind' && direcitve.arg || direcitve.name!='bind', 'not defined what to bind '+key);
      assert(direcitve.name=='on' && direcitve.arg || direcitve.name!='on', 'event name is not defined');

      //v-model="a"
      //{name: 'model', arg: undefined}, value=>attrs[key]

      //:value="a" + @input="a=$event.target.value"

      //@input="value=$event.targe4t"

      if(direcitve.name=='model'){
        directives.push({
          name: 'on',
          arg: 'input',
          value: `${attrs[key]}=$event.target.value`,
          meta: {}
        });
        directives.push({
          name: 'bind',
          arg: 'value',
          value: attrs[key],
          meta: {}
        });
      }else{
        direcitve.meta={};

        direcitve.value=attrs[key];
        directives.push(direcitve);
      }
    }
  }

  return directives;
}

export function parseListeners(directives){
  assert(directives);
  assert(directives instanceof Array);

  return directives.filter(directive=>directive.name=='on');
}
