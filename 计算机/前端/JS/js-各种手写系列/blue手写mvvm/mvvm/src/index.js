import Vue from './vue';

Vue.component('cmp1', {
  template: `
    <div class="box">
      <button @click="$emit('abc', 12, 5)">触发</button>
    </div>
  `,
  created(){
    this.$on('aaakkk', sum=>{
      console.log('sum', sum);
    });
  }
});

window.vm=new Vue({
  el: '#root',
  data: {
    a: 12,
  },
  mounted(){
    this.$refs.ccc.$on('abc', (a, b)=>{
      alert('aaaaaaaaaaa');
      console.log(a, b);
    });

    setInterval(()=>{
      this.$refs.ccc.$emit('aaakkk', 88);
    }, 200);
  }
});
