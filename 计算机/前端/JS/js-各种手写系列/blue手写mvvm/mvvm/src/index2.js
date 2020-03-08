import Vue from './vue';

window.vm=new Vue({
  el: '#root',
  data: {
    a: 1,
    b: 1,
    c: 1,
  },
  methods: {
    fn(){
      this.a++;
    },

    fn2(){
      this.show=!this.show;
    },

    show(arg){
      alert(arg);
    }
  },
  watch: {
    // a(){
    //   this.b++;
    // },
    // json(){
    //   console.log('json变了')
    // },
    // 'json.user'(){
    //   console.log('json.user变了');
    // },
  },
  computed: {
    sum(){
      return this.a+this.b;
    }
  },
  directives: {
    href: {
      init(velement, directive){
        velement._el.onclick=function (){
          window.open(directive.value);
        }
      },
      update(velement, directive){

      }
    }
  },
  // created(){
  //   console.log('初始化完成');
  // },
  // updated(){
  //   console.log('更新了');
  // }
});
