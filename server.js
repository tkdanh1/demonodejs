
const express = require("express");
const session = require('express-session');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const user = require('./routers/user.route');
const app = express();
const PORT = 3030;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(expressValidator());
app.use(session({
  secret: 'tkdanh',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

var server = require("http").Server(app);
var io = require('socket.io')(server);
server.listen(PORT);

// user routers
app.use('/user', user);
//handle post method
app.post('/user', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  console.log('username: ' + username + ' password: ' + password);

  var sess = req.session;
  sess.username = username;
  sess.password = password;

  if(sess.username === 'admin' && sess.password === 'admin'){
    res.redirect('/trangchu');
  }else{
    res.redirect('/login');
  }
  res.end('yes');
});

var arrUserOnline = [];
io.on("connection", function(socket){
  console.log("Connected: ", socket.id);
// recieve data from client
  socket.on("client_send_username", function(user){
    if (user.trim() !== ""){
      console.log("New user has registered: ", user);

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
    }else{
      socket.emit("server_send_emty_user");
    }
  });
  //recieve message from client
  socket.on("client_send_message", function(data){
    if (socket.Username !== undefined){
      io.sockets.emit("server_send_message", {Username:socket.Username, msg:data});
    }

  });
  //recieve event user_buscu_user
  socket.on("user_buscu_user", function(data){
    if (data !== socket.Username){
      io.to(data).emit("server_send_buscu_user", socket.Username);
    }
  });
});
app.get('/login', function(req, res){
  res.render('login');
});
app.get("/trangchu", function(req, res){
  res.render('trangchu');
});
