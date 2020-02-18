class VText extends VNode{
  constructor(dom, component){
    assert(component);

    super(dom);

    this._component=component;

    this._text=dom.data.trim();
  }

  render(){
    // this._text => 'a={{a}}'
    let n=0;


/*stringObject.indexOf()的第一个参数必需。规定需检索的字符串值；
  第二个参数可选的整数参数。规定在字符串中开始检索的位置。
  它的合法取值是 0 到 stringObject.length - 1。如省略该参数，
  则将从字符串的首字符开始检索。
  */
    while((n=this._text.indexOf('[[', n))!=-1){   
      if(n!=-1){
        let end;
        let count=2;    //方括号的数量
        let count2=0;   //单引号的数量
        for(let i=n+2;i<this._text.length;i++){
          if(this._text[i]==']'){
            if(count2==0)count--;
          }else if(this._text[i]=='['){
            if(count2==0)count++;
          }else if(this._text[i]=="'" && this._text[i-1]!="\\"){
            if(count2==0){
              count2=1;
            }else{
              count2=0;
            }
          }

          if(count==0){
            end=i;
            break;
          }
        }

        assert(count==0, `"${this._text} is invaild"`);

        let s=this._text.substring(n, end+1);
        n=end+1;

        s=s.substring(2, s.length-2).trim();
        console.log(s, this._component._data);

        //TODO
      }
    }
  }
}
