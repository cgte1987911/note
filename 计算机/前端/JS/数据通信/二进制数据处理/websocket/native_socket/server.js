const net=require('net');
const crypto=require('crypto');

let server=net.createServer(socket=>{
  console.log('连接上了');

  socket.once('data', buffer=>{
    let headers=parseHttpHeaders(buffer);

    if(headers.upgrade!='websocket'){
      socket.end();
    }else if(headers['sec-websocket-version']!=13){
      socket.end();
    }else{
      //258EAFA5-E914-47DA-95CA-C5AB0DC85B11
      //accept= sha1(key+mask).base64()
      let key=headers['sec-websocket-key'];
      const mask='258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

      let hash=crypto.createHash('sha1');
      hash.update(key+mask);

      let accept=hash.digest('base64');

      socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);

      socket.on('data', buffer=>{
        //正式处理前台的数据了
        let a=buffer[0];
        let fin=a&127;

        console.log(fin);
      });
    }
  });
  socket.on('end', ()=>{
    console.log('连接已经结束了');
  })
});
server.listen(8080);




function parseHttpHeaders(buffer){
  let str=buffer.toString();
  let arr=str.split('\r\n');

  //第1个扔掉
  arr.shift();
  //空的不要
  arr=arr.filter(str=>str);

  let headers={};
  arr.forEach(str=>{
    let [key, val]=str.split(':');

    key=key.trim().toLowerCase();
    val=val.trim();

    headers[key]=val;
  });

  return headers;
}
