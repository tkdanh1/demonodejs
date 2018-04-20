var express = require("express");
var app = express();
var session = require('express-session');

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
var server = require("http").Server(app);
var io = require('socket.io')(server);
server.listen(3030);

var arrUserOnline = [];
io.on("connection", function(socket){
  console.log("Connected: ", socket.id);
// recieve data from client
  socket.on("client_send_username", function(user){
    if (user !== ""){
      console.log("New user has registered: ", user);
    }
    if (arrUserOnline.indexOf(user) >= 0){
      socket.emit("server_send_fail_register", user);
    }else{
      arrUserOnline.push(user);
      //define a new attribute of socket
      socket.Username = user;
      // server send data to all socket
      io.sockets.emit("server_send_list_useronline", {username:user, id:socket.id});
      socket.emit("server_send_register_success", user);
    }
  });
  //recieve message from client
  socket.on("client_send_message", function(data){
      io.sockets.emit("server_send_message", {Username:socket.Username, msg:data});
  });
  //recieve event user_buscu_user
  socket.on("user_buscu_user", function(data){
    if (data !== socket.Username){
      io.to(data).emit("server_send_buscu_user", socket.Username);
    }
  });
});

app.get("/trangchu", function(req, res){
    res.render("trangchu");
});
