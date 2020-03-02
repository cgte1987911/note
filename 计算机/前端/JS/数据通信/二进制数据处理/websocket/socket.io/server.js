const http=require('http');
const io=require('socket.io');

let server=http.createServer(()=>{});
server.listen(8081);

//
let wsServer=io.listen(server);

let txt='';
let sockets=[];

wsServer.on('connection', socket=>{
  sockets.push(socket);

  socket.emit('change', txt);

  socket.on('disconnection', ()=>{
    sockets=sockets.filter(sock=>sock!=socket);
  });

  socket.on('change', function (str){
    txt=str;

    sockets.forEach(sock=>{
      sock.emit('change', str);
    });
  });
});
