import Vue from './vue';
import Router from './vue-router';

Vue.component('cmp1', {
  template: `
    <div>组件1</div>
  `,
  // created(){
  //   alert(1111);
  // }
});

Vue.component('cmp2', {
  template: `
    <div>组件2</div>
  `
});

//----------------------------------
let router=new Router({
  routes: [
    {path: '/a', component: 'cmp1', meta: {
      name: 'blue'
    }},
    {path: '/b', component: 'cmp2', meta: {
      name: 'zhangsan'
    }},
    {path: '/c', component: 'c'},
  ]
});



//----------------------------------

window.vm=new Vue({
  el: '#root',
  data: {
    a: 12,
  },
  components: {
    c: {
      template: `<div>asdfasfasdasdfdsafasfasfd</div>`
    }
  },
  router
});
