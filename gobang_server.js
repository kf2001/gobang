const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
var allClients = [];
var nicks = "";
var attende = null;


app.use(express.static('./public'));


app.get('/', function (req, res) {
    res.redirect('/gobang.html');
});

app.get("/reboot", (req, res) => {
git commit 
  process.exit(1)
})
var activeClients = 0;


io.sockets.on('connection', function (socket) {

  allClients.push(socket);

  if (activeClients < 20) {

    activeClients += 1;
    console.log(activeClients);
    io.sockets.emit('message', { clients: activeClients });
    socket.emit('numero', activeClients % 2 + 1);


    socket.on('disconnect', function () {
      activeClients -= 1;
      var i = allClients.indexOf(socket);

      if (activeClients % 2 == 1) attende = allClients[i].avversario; else attende = null;
      allClients[i].avversario.emit('andato');
      io.sockets.emit('message', { clients: activeClients });
      delete allClients[i];


    });

    socket.on('daclient', function (msg) {
      console.log("ricevuta");
    
      socket.emit('draw', msg);
      socket.avversario.emit('draw', msg);

    });
    socket.on('join', function (msg) {
      console.log("nick arrivato: " + msg);
      socket.nickname = msg;
      nicks += msg + "-";
      console.log("connesso " + msg);

      io.sockets.emit('lista', nicks);

      if (activeClients % 2 == 1) {// cerca avversario 
        attende = socket;
     
      }
      if (activeClients % 2 == 0) {// trovato avversario 
        socket.avversario = attende;
        attende.avversario = socket;

        socket.emit('start', socket.avversario.nickname, 1);
        socket.avversario.emit('start', socket.nickname, 2);

      }
    });
  }
});



const port = process.env.PORT || 3000;


httpServer.listen(port);

console.log("Server in ascolto alla porta " + port);

