const defaultOptions={
  method: 'get',
  headers: {},
};

// window.fetch=window.fetch||function (url, options){
window.fetch=function (url, options){
  options=Object.assign({}, defaultOptions, options);

  return new Promise((resolve, reject)=>{
    let xhr=new XMLHttpRequest();

    xhr.open(options.method, url, true);
    xhr.send(options.body);

    xhr.onreadystatechange=function (){
      if(xhr.readyState==3){
        if(xhr.status>=200 && xhr.status<300 || xhr.status==304){
          resolve(new FetchResponse(xhr))
        }else{
          reject(xhr);
        }
      }
    };
  });
};

class FetchResponse{
  constructor(xhr){
    this._data=new Promise((resolve, reject)=>{
      xhr.onreadystatechange=function (){
        resolve(xhr);
      };
    });
  }

  json(){
    return new Promise((resolve, reject)=>{
      this.text().then(txt=>{
        try{
          let json=JSON.parse(txt);

          resolve(json);
        }catch(e){
          reject(e);
        }
      });
    });
  }

  text(){
    return new Promise((resolve, reject)=>{
      this._data.then(xhr=>{
        resolve(xhr.responseText);
      });
    });
  }
}
