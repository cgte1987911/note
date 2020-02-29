```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <script>
    class Promise2{
      constructor(cb){
        this.end=false;
        this.err=false;
        this.result=null;
        
        cb((...args)=>{
          this.end=true;
          this.err=false;
          this.result=args;

          if(this.succ){
            this.succ(...args);
          }
        }, (...args)=>{
          this.end=true;
          this.err=true;
          this.result=args;

          if(this.faild){
            this.faild(...args);
          }
        });
      }

      then(succ, faild){
        this.succ=succ;
        this.faild=faild;

        if(this.end){
          if(this.err){
            faild(...this.result);
          }else{
            succ(...this.result);
          }
        }
      }
    }
    </script>
  </body>
</html>

```
