console.log(1);

async function  test(){
    let a=await new Promise((resolve,reject)=>{
        setTimeout(function(){
            console.log(2)
            resolve(4)
        },1000)
    })

    console.log(a)
}

test()

console.log(3)