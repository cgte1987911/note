console.log(1);

new Promise((resolve,reject)=>{
    setTimeout(function(){
        console.log(2)
        resolve(4)
    },1000)}).then(()=>{console.log(a)})

console.log(3)