const uuid=require('uuid/v4');
const {key_count,key_path,key_len}=require('../config')
const fs=require('fs')

let arr=[]
for(let i=0;i<key_count;i++){
    let key=''
    while(key.length<key_len){
        key+=uuid().replace(/\-/g,'');
    }
    key=key.substring(0,key_len)
    arr.push(key);
}


fs.writeFileSync(key_path,JSON.stringify(arr))
console.log(`generated ${key_count} keys`)