var fs=require('fs');
var str=fs.readFileSync('data.txt');
var arr=eval('('+str+')');

function rnd(n,m){
    return Math.floor(Math.random()*(m-n)+n);
}

var result=[];

while(result.length<5){
    var n=rnd(0,arr.length);
    result.push(arr[n]);
    arr.splice(n,1)
}
console.log('最终结果：',result)