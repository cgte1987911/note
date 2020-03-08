import VElement from './velement';
import VText from './vtext';
// import VComponent from './vcomponent';

import {assert} from './common';

export function createVDom(node, parent, component){
  assert(node);
  assert(node._blue);
  assert(node.type=='element' || node.type=='text');



  if(node.type=='element'){
    if(node.ishtml){
      //VElement
      let ele=new VElement(node, parent);

      ele.$children=node.children.map(child=>{
        return createVDom(child, ele, component);
      });
      ele.$root=component;

      return ele;
    }else{
      //VComponent
      //node
      // let cmp=new VComponent({}, parent);
      // cmp.$children=node.children.map(child=>{
      //   return createVDom(child, cmp, cmp);
      // });
      // cmp.$root=cmp;

      return node;
    }
  }else{
    //VText
    let txt=new VText(node, parent);
    txt.$root=component;

    return txt;
  }
}
