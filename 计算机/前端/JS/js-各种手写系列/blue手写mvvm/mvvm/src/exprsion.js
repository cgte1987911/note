import {assert} from './common';

const keyword={
  'new': true,
  'class': true,
  'for': true,
}

//str=> "a"
//str=> "a+b"
//str=> "json.name+'b'"
//str=> "fn(a+b)"
export function expr(str, data, filters){
  // assert(filters);
  let strArr=str.split('|');

  str=strArr[0];

  function parseGlobal(s, localExpr){
    if((s in window) || keyword[s] && !data[s]){
      return s;
    }else{
      return localExpr;
    }
  }



  let arr=parseExpr(str);

  let arr2=arr.map(item=>{
    if(typeof item=='string')return "'"+item+"'";
    else{
      let str=item.expr.replace(/.?[\$_a-z][a-z0-9_\$]*/ig, function (s){
        if(/[\$_a-z]/i.test(s[0])){
          return parseGlobal(s, 'data.'+s);
        }else{
          if(s[0]=='.'){
            return s;
          }else{
            return s[0]+parseGlobal(s.substring(1), 'data.'+s.substring(1));
          }
        }
      });

      return str;
    }
  });

  let str2=arr2.join('');

  // if(str2=='data.fn(data.$event)'){
  //   throw new Error('a');
  // }

  let result=eval(str2);

  //
  strArr.slice(1).forEach(name=>{
    result=filters[name](result);
  })

  return result;

}

export function compileStringTemplate(str, data, filters){
  assert(filters);
  let s=0;

  //{{xxx}}
  let arr=[];

  let n=0;
  while((n=str.indexOf('{{', s))!=-1){
    arr.push(str.substring(s, n));    //?

    let m=2;
    let e;
    for(let i=n+2;i<str.length;i++){
      if(str[i]=='{')m++;
      else if(str[i]=='}')m--;

      if(m==0){
        e=i;
        break;
      }
    }

    if(m>0){
      throw new Error('花括号不匹配');
    }

    let strExpr=str.substring(n+2, e-1);
    let result=expr(strExpr, data, filters);

    if(typeof result=='object'){
      arr.push(JSON.stringify(result));
    }else{
      arr.push(result);
    }


    s=e+1;
  }

  arr.push(str.substring(s));

  return arr.join('');
}




function parseExpr(str){
  let arr=[];

  while(1){
    let n=str.search(/'|"/);
    if(n==-1){
      arr.push({expr: str});
      break;
    }

    let m=n+1;
    while(1){
      m=str.indexOf(str[n], m);
      if(m==-1){
        throw new Error('引号没配对');
      }

      if(str[m-1]=='\\'){
        m++;
        continue;
      }else{
        break;
      }
    }

    arr.push({expr: str.substring(0, n)});
    arr.push(str.substring(n+1, m));
    str=str.substring(m+1);
  }

  return arr;
}
