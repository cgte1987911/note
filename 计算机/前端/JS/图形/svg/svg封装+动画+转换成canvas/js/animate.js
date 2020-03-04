function linear(scale){
  return scale;
}

function easein(scale){
  return scale*scale*scale;
}

function easeout(scale){
  return 1-Math.pow(1-scale, 3);
}


function animate(start, end, time, cb, timing){
  let startTime=Date.now();
  return new Promise(resolve=>{
    let timer=setInterval(function (){
      let past=Date.now()-startTime;

      let scale=past/time;
      if(scale>1)scale=1;

      scale=timing(scale);

      //
      let res={};
      for(let key in start){
        res[key]=start[key]+(end[key]-start[key])*scale;
      }

      cb&&cb(res);

      if(scale==1){
        clearInterval(timer);
        resolve();
      }
    }, 1000/60);
  });
}
